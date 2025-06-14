import sys
import pandas as pd
from sqlalchemy import create_engine
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from fuzzywuzzy import fuzz

# Obtener los argumentos de la línea de comandos
user_id = sys.argv[1]
num_recomendaciones = int(sys.argv[2])

# Conectar a la base de datos usando SQLAlchemy
try:
    engine = create_engine('postgresql://usuario:12345@127.0.0.1:5432/sistema_recomendacionf')
    connection = engine.connect()
    connection.close()
except Exception as e:
    print(f"{{\"error\": \"Error al conectar a la base de datos: {e}\"}}")
    sys.exit(1)

try:
    preferences_query = "SELECT * FROM preferences WHERE \"userId\" = %s ORDER BY \"createdAt\" DESC LIMIT 1"
    motos_query = "SELECT * FROM motos"
    ratings_query = "SELECT * FROM ratings"

    preferences_df = pd.read_sql(preferences_query, engine, params=(user_id,))
    motos_df = pd.read_sql(motos_query, engine)
    ratings_df = pd.read_sql(ratings_query, engine)
except Exception as e:
    print(f"{{\"error\": \"Error al obtener datos de la base de datos: {e}\"}}")
    sys.exit(1)

def recomendar_motocicletas_colaborativo(user_id, num_recomendaciones=5):
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[['userId', 'motoId', 'rating']], reader)
    trainset, _ = train_test_split(data, test_size=0.25)
    algo = SVD()
    algo.fit(trainset)

    if not preferences_df.empty:
        user_preferences = preferences_df.iloc[0]
        nombre = user_preferences.get('nombre')
        marca = user_preferences.get('marca')
        cilindraje = user_preferences.get('cilindraje')
        precioMin = user_preferences.get('precioMin')
        precioMax = user_preferences.get('precioMax')

        cilindraje = float(cilindraje) if cilindraje is not None else None
        precioMin = float(precioMin) if precioMin is not None else None
        precioMax = float(precioMax) if precioMax is not None else None
        motos_df['cilindraje'] = motos_df['cilindraje'].astype(float)
        motos_df['precio'] = motos_df['precio'].astype(float)

        # Buscar coincidencia exacta normalizada (sin espacios y en minúsculas)
        exacto_filtro = pd.Series([True] * len(motos_df))
        if nombre:
            exacto_filtro &= motos_df['nombre'].str.strip().str.lower() == str(nombre).strip().lower()
        if marca:
            exacto_filtro &= motos_df['marca'].str.strip().str.lower() == str(marca).strip().lower()
        if cilindraje is not None:
            exacto_filtro &= (motos_df['cilindraje'] == float(cilindraje))
        if precioMin is not None:
            exacto_filtro &= (motos_df['precio'] >= precioMin)
        if precioMax is not None:
            exacto_filtro &= (motos_df['precio'] <= precioMax)
        moto_exacta = motos_df[exacto_filtro]

        # Filtrar por fuzzy y preferencias flexibles (marca solo si hay suficientes resultados)
        filtro = pd.Series([True] * len(motos_df))
        if precioMin is not None:
            filtro &= (motos_df['precio'] >= precioMin)
        if precioMax is not None:
            filtro &= (motos_df['precio'] <= precioMax)
        if cilindraje is not None:
            filtro &= (abs(motos_df['cilindraje'] - cilindraje) <= 50)
        if nombre:
            filtro &= motos_df['nombre'].apply(lambda x: fuzz.token_set_ratio(str(x).lower(), str(nombre).lower()) >= 85)
        # Marca solo si el usuario la especificó
        if marca:
            filtro_marca = filtro & motos_df['marca'].apply(lambda x: fuzz.token_set_ratio(str(x).lower(), str(marca).lower()) >= 85)
            motos_filtradas = motos_df[filtro_marca]
            # Si no hay suficientes motos de la marca, rellena con otras marcas pero siempre respetando el precio
            if len(motos_filtradas) < num_recomendaciones:
                motos_filtradas = pd.concat([
                    motos_filtradas,
                    motos_df[filtro & ~motos_df['marca'].apply(lambda x: fuzz.token_set_ratio(str(x).lower(), str(marca).lower()) >= 85)]
                ]).drop_duplicates()
        else:
            motos_filtradas = motos_df[filtro]

        # Rellenar con motos de cilindraje similar (sin importar marca, pero siempre respetando precio)
        if len(motos_filtradas) < num_recomendaciones and cilindraje is not None:
            filtro_cilindraje = (abs(motos_df['cilindraje'] - cilindraje) <= 50)
            if precioMin is not None:
                filtro_cilindraje &= (motos_df['precio'] >= precioMin)
            if precioMax is not None:
                filtro_cilindraje &= (motos_df['precio'] <= precioMax)
            motos_cilindraje = motos_df[filtro_cilindraje]
            motos_filtradas = pd.concat([motos_filtradas, motos_cilindraje]).drop_duplicates()
    else:
        motos_filtradas = motos_df
        moto_exacta = pd.DataFrame()  

    # Predecir para todas las motos filtradas que el usuario no ha calificado
    motos_no_calificadas = motos_filtradas[~motos_filtradas['id'].isin(ratings_df[ratings_df['userId'] == int(user_id)]['motoId'])]

    predicciones = []
    for moto_id in motos_no_calificadas['id']:
        pred = algo.predict(int(user_id), moto_id)
        predicciones.append((moto_id, pred.est))

    predicciones.sort(key=lambda x: x[1], reverse=True)
    mejores_recomendaciones = [moto_id for moto_id, _ in predicciones[:num_recomendaciones]]

    recomendaciones = motos_df[motos_df['id'].isin(mejores_recomendaciones)]

    # --- Unir la moto exacta al principio, sin duplicados ---
    if not moto_exacta.empty:
        recomendaciones = pd.concat([moto_exacta, recomendaciones]).drop_duplicates().head(num_recomendaciones)

    return recomendaciones

try:
    recomendaciones = recomendar_motocicletas_colaborativo(user_id, num_recomendaciones)
except Exception as e:
    print(f"{{\"error\": \"Error al generar recomendaciones: {e}\"}}")
    sys.exit(1)

try:
    recomendaciones_json = recomendaciones[['id', 'nombre', 'marca', 'cilindraje', 'precio', 'peso', 'transmision', 'freno_delantero', 'freno_trasero', 'modelo', 'imagen']].to_json(orient="records")
    print(recomendaciones_json)
except Exception as e:
    print(f"{{\"error\": \"Error al convertir recomendaciones a JSON: {e}\"}}")
    sys.exit(1)
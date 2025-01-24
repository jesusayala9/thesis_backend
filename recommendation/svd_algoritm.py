import sys
import pandas as pd
from sqlalchemy import create_engine
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

# Obtener los argumentos de la línea de comandos
user_id = sys.argv[1]
num_recomendaciones = int(sys.argv[2])

# Conectar a la base de datos usando SQLAlchemy
try:
    engine = create_engine('postgresql://usuario:12345@127.0.0.1:5432/sistema_recomendacionf')
    connection = engine.connect()
    connection.close()
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
    sys.exit(1)

try:
    # Obtener los datos de las tablas preferences, motos y ratings
    preferences_query = "SELECT * FROM preferences WHERE \"userId\" = %s ORDER BY \"createdAt\" DESC LIMIT 1"
    motos_query = "SELECT * FROM motos"
    ratings_query = "SELECT * FROM ratings"

    preferences_df = pd.read_sql(preferences_query, engine, params=(user_id,))
    motos_df = pd.read_sql(motos_query, engine)
    ratings_df = pd.read_sql(ratings_query, engine)
except Exception as e:
    print(f"Error al obtener datos de la base de datos: {e}")
    sys.exit(1)

# Definir la función de recomendación colaborativa
def recomendar_motocicletas_colaborativo(user_id, num_recomendaciones=5):
    # Preparar los datos para Surprise
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[['user_id', 'moto_id', 'rating']], reader)
    
    # Dividir los datos en conjuntos de entrenamiento y prueba
    trainset, testset = train_test_split(data, test_size=0.25)
    
    # Entrenar el modelo SVD
    algo = SVD()
    algo.fit(trainset)
    
    # Filtrar las motos basadas en las preferencias del usuario
    if not preferences_df.empty:
        user_preferences = preferences_df.iloc[0]
        nombre = user_preferences['nombre']
        marca = user_preferences['marca']
        cilindraje = user_preferences['cilindraje']
        
        motos_filtradas = motos_df[
            (motos_df['nombre'] == nombre) |
            (motos_df['marca'] == marca) |
            (motos_df['cilindraje'] == cilindraje)
        ]
    else:
        motos_filtradas = motos_df
    
    # Obtener todas las motos que el usuario no ha calificado
    motos_no_calificadas = motos_filtradas[~motos_filtradas['id'].isin(ratings_df[ratings_df['user_id'] == int(user_id)]['moto_id'])]
    
    # Predecir las calificaciones para las motos no calificadas
    predicciones = []
    for moto_id in motos_no_calificadas['id']:
        pred = algo.predict(user_id, moto_id)
        predicciones.append((moto_id, pred.est))
    
    # Ordenar las predicciones por calificación estimada
    predicciones.sort(key=lambda x: x[1], reverse=True)
    
    # Obtener las mejores recomendaciones
    mejores_recomendaciones = [moto_id for moto_id, _ in predicciones[:num_recomendaciones]]
    
    # Filtrar las motos recomendadas
    recomendaciones = motos_df[motos_df['id'].isin(mejores_recomendaciones)]
    
    # Incluir las motos que coinciden exactamente con las preferencias del usuario
    motos_exactas = motos_df[
        (motos_df['nombre'] == nombre) &
        (motos_df['marca'] == marca) &
        (motos_df['cilindraje'] == cilindraje)
    ]
    
    # Combinar las recomendaciones colaborativas con las motos exactas
    recomendaciones = pd.concat([recomendaciones, motos_exactas]).drop_duplicates().head(num_recomendaciones)
    
    return recomendaciones

# Obtener las recomendaciones colaborativas
try:
    recomendaciones = recomendar_motocicletas_colaborativo(user_id, num_recomendaciones)
except Exception as e:
    print(f"Error al generar recomendaciones: {e}")
    sys.exit(1)

# Imprimir las recomendaciones en formato JSON
try:
    recomendaciones_json = recomendaciones[['nombre', 'marca', 'cilindraje', 'peso', 'transmision', 'freno_delantero', 'freno_trasero', 'modelo']].to_json(orient="records")
    print(recomendaciones_json)
except Exception as e:
    print(f"Error al convertir recomendaciones a JSON: {e}")
    sys.exit(1)
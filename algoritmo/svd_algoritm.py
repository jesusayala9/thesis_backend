import pandas as pd
from surprise import Dataset, Reader, SVD, accuracy
from surprise.model_selection import train_test_split, GridSearchCV
from sqlalchemy import create_engine
import sys

# Conectar a la base de datos PostgreSQL
engine = create_engine('postgresql://usuario:12345@localhost:5432/sistema_recomendacionf')

# Cargar los datos de la tabla 'motos'
df = pd.read_sql('SELECT * FROM motos', engine)

# Filtrar valores atípicos en la columna 'Cilindraje'
df = df[df['cilindraje'] <= 500]

# Crear un objeto Reader y cargar los datos en un Dataset
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df[['nombre', 'marca', 'cilindraje']], reader)

# Dividir los datos en conjuntos de entrenamiento y prueba
trainset, testset = train_test_split(data, test_size=0.25)

# Definir el rango de hiperparámetros para buscar
param_grid = {
    'n_factors': [50, 100, 150],
    'lr_all': [0.002, 0.005, 0.01],
    'reg_all': [0.02, 0.05, 0.1]
}

# Realizar la búsqueda de hiperparámetros
gs = GridSearchCV(SVD, param_grid, measures=['rmse'], cv=3)
gs.fit(data)

# Obtener los mejores parámetros
print(gs.best_params['rmse'])

# Entrenar el modelo con los mejores parámetros
algo = gs.best_estimator['rmse']
algo.fit(trainset)

# Evaluar el modelo
predictions = algo.test(testset)
accuracy.rmse(predictions)

# Obtener los parámetros de entrada
user_id = sys.argv[1]
nombre_preferido = sys.argv[2] if len(sys.argv) > 2 else None
marca_preferida = sys.argv[3] if len(sys.argv) > 3 else None
cilindraje_preferido = float(sys.argv[4]) if len(sys.argv) > 4 else None
num_recomendaciones = int(sys.argv[5]) if len(sys.argv) > 5 else 10

# Definir la función de recomendación
def recomendar_motocicletas(nombre_preferido=None, marca_preferida=None, cilindraje_preferido=None, num_recomendaciones=5):
    # Filtrar las motocicletas según las preferencias del usuario
    df_filtrado = df.copy()
    if nombre_preferido:
        df_filtrado = df_filtrado[df_filtrado['nombre'].str.lower() == nombre_preferido.lower()]
    if marca_preferida:
        df_filtrado = df_filtrado[df_filtrado['marca'].str.lower() == marca_preferida.lower()]
    if cilindraje_preferido:
        df_filtrado = df_filtrado[df_filtrado['cilindraje'] == cilindraje_preferido]
    
    # Obtener todas las motocicletas que el usuario no ha calificado
    moto_ids = df_filtrado['nombre'].unique()
    motos_calificadas = df[df['nombre'] == nombre_preferido]['nombre'].values if nombre_preferido else []
    motos_no_calificadas = [moto_id for moto_id in moto_ids if moto_id not in motos_calificadas]
    
    # Predecir la calificación para cada motocicleta no calificada
    predicciones = [algo.predict(nombre_preferido, moto_id) for moto_id in motos_no_calificadas] if nombre_preferido else []
    
    # Si no hay predicciones (porque no se proporcionó nombre_preferido), simplemente selecciona las primeras motocicletas filtradas
    if not predicciones:
        mejores_moto_ids = moto_ids[:num_recomendaciones]
    else:
        # Ordenar las predicciones por la calificación estimada
        predicciones.sort(key=lambda x: x.est, reverse=True)
        # Obtener las mejores recomendaciones
        mejores_recomendaciones = predicciones[:num_recomendaciones]
        mejores_moto_ids = [pred.iid for pred in mejores_recomendaciones]
    
    # Retornar las motocicletas recomendadas
    return df[df['nombre'].isin(mejores_moto_ids)]

# Obtener las recomendaciones
recomendaciones = recomendar_motocicletas(nombre_preferido, marca_preferida, cilindraje_preferido, num_recomendaciones)

# Imprimir las recomendaciones en formato JSON
print(recomendaciones[['nombre', 'marca', 'cilindraje', 'peso', 'transmision', 'freno_delantero', 'freno_trasero', 'modelo']].to_json(orient="records"))
import sys
import pandas as pd
from sqlalchemy import create_engine

# Obtener los argumentos de la línea de comandos
user_id = sys.argv[1]
num_recomendaciones = int(sys.argv[2])

# Conectar a la base de datos usando SQLAlchemy
try:
    engine = create_engine('postgresql://usuario:12345@127.0.0.1:5432/sistema_recomendacionf')
    connection = engine.connect()
    connection.close()
except Exception as e:
    sys.exit(1)

try:
    # Obtener los datos de las tablas preferences y motos
    preferences_query = "SELECT * FROM preferences WHERE \"userId\" = %s ORDER BY \"createdAt\" DESC LIMIT 1"
    motos_query = "SELECT * FROM motos"

    preferences_df = pd.read_sql(preferences_query, engine, params=(user_id,))
    motos_df = pd.read_sql(motos_query, engine)
except Exception as e:
    sys.exit(1)

# Definir la función de recomendación
def recomendar_motocicletas(preferences_df, num_recomendaciones=5):
    # Filtrar las motocicletas según las preferencias del usuario
    df_filtrado = motos_df.copy()
    if not preferences_df.empty:
        if 'nombre' in preferences_df.columns and preferences_df['nombre'].iloc[0] and preferences_df['nombre'].iloc[0] != 'null':
            df_filtrado = df_filtrado[df_filtrado['nombre'].str.lower() == preferences_df['nombre'].iloc[0].lower()]
        if 'marca' in preferences_df.columns and preferences_df['marca'].iloc[0] and preferences_df['marca'].iloc[0] != 'null':
            df_filtrado = df_filtrado[df_filtrado['marca'].str.lower() == preferences_df['marca'].iloc[0].lower()]
        if 'cilindraje' in preferences_df.columns and preferences_df['cilindraje'].iloc[0] and preferences_df['cilindraje'].iloc[0] != 'null':
            df_filtrado = df_filtrado[df_filtrado['cilindraje'] == float(preferences_df['cilindraje'].iloc[0])]
    
    # Si no se proporcionaron preferencias, devolver las primeras motocicletas filtradas
    if df_filtrado.empty:
        return motos_df.head(num_recomendaciones)
    
    # Retornar las motocicletas recomendadas
    return df_filtrado.head(num_recomendaciones)

# Obtener las recomendaciones
try:
    recomendaciones = recomendar_motocicletas(preferences_df, num_recomendaciones)
except Exception as e:
    sys.exit(1)

# Imprimir las recomendaciones en formato JSON
try:
    recomendaciones_json = recomendaciones[['nombre', 'marca', 'cilindraje', 'peso', 'transmision', 'freno_delantero', 'freno_trasero', 'modelo']].to_json(orient="records")
    print(recomendaciones_json)
except Exception as e:
    sys.exit(1)
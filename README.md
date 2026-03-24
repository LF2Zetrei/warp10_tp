# ISS Monitor 🚀

> **Weyland-Yutani Corp — Station Spatiale Surveillance System**  
> Application de monitoring de séries temporelles pour une station spatiale, construite avec Next.js et Warp10.

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 16** (App Router) | Framework frontend + API Routes |
| **Warp10 3.4.1** | Base de données séries temporelles |
| **@senx/warp10** | Client Node.js officiel Warp10 |
| **Recharts** | Graphiques séries temporelles |
| **Docker** | Conteneurisation de Warp10 |
| **Tailwind CSS v4** | Styles |
| **dayjs** | Manipulation des dates |

---

## Prérequis

- Node.js 18+
- Docker
- npm

---

## Installation

### 1. Lancer Warp10 avec Docker

```bash
docker run -d \
  --name warp10 \
  -p 8080:8080 \
  -p 8081:8081 \
  --volume warp10_data:/data \
  warp10io/warp10:3.4.1-ubuntu
```

### 2. Générer les tokens Warp10

```bash
# Créer le fichier d'enveloppe
cat > /tmp/envelope.mc2 << 'EOF'
'myapp' 'applicationName' STORE
NOW 1 ADDYEARS 'expiryDate' STORE
UUID 'ownerAndProducer' STORE

{
  'id' 'TokenRead'
  'type' 'READ'
  'application' $applicationName
  'owner' $ownerAndProducer
  'issuance' NOW
  'expiry' $expiryDate
  'labels' {}
  'attributes' {}
  'owners' [ $ownerAndProducer ]
  'producers' [ $ownerAndProducer ]
  'applications' [ $applicationName ]
}
TOKENGEN

{
  'id' 'TokenWrite'
  'type' 'WRITE'
  'application' $applicationName
  'owner' $ownerAndProducer
  'producer' $ownerAndProducer
  'issuance' NOW
  'expiry' $expiryDate
  'labels' {}
  'attributes' {}
}
TOKENGEN
EOF

# Générer les tokens
docker exec -i warp10 warp10.sh tokengen - < /tmp/envelope.mc2
```

### 3. Cloner et configurer le projet

```bash
git clone <repo-url>
cd iss-monitor
npm install
```

### 4. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
WARP10_URL=http://localhost:8080
WARP10_WRITE_TOKEN=<votre_write_token>
WARP10_READ_TOKEN=<votre_read_token>
```

### 5. Lancer le projet

```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## Structure du projet

```
iss-monitor/
├── app/
│   ├── api/
│   │   ├── health/route.js           # GET  - Santé de l'API
│   │   ├── sensors/
│   │   │   ├── route.js              # GET, POST - Liste et création capteurs
│   │   │   └── [id]/route.js         # GET, PUT, DELETE - Gestion par ID
│   │   └── gts/
│   │       ├── write/route.js        # POST - Écriture d'une mesure
│   │       ├── read/route.js         # GET  - Lecture historique
│   │       ├── simulate/route.js     # POST - Simulation de données
│   │       └── analyze/route.js      # GET  - Statistiques WarpScript
│   ├── components/
│   │   ├── Navbar.js                 # Navigation principale
│   │   ├── ModuleCard.js             # Carte résumé d'un module
│   │   ├── SensorCard.js             # Carte capteur avec graphique
│   │   ├── SensorChart.js            # Graphique Recharts
│   │   ├── SensorRow.js              # Ligne tableau capteur
│   │   ├── AddSensorForm.js          # Formulaire ajout capteur
│   │   ├── StatusBadge.js            # Badge nominal/warning/critical
│   │   ├── StatusStats.tsx           # Stats distribution status
│   │   ├── StatsTable.tsx            # Tableau statistiques numériques
│   │   ├── SimulateButton.js         # Bouton simulation données
│   │   ├── AlienCard.js              # Composant carte stylisée
│   │   └── SectionTitle.js          # Titre de section
│   ├── modules/[module]/page.tsx     # Vue détaillée par module
│   ├── sensors/page.tsx             # Gestion des capteurs
│   ├── stats/page.tsx               # Statistiques générales
│   └── page.tsx                     # Dashboard principal
├── lib/
│   ├── warp10.js                     # Client Warp10
│   ├── sensors.js                    # Store en mémoire des capteurs
│   └── thresholds.js                 # Seuils d'anomalies
└── .env.local                        # Variables d'environnement
```

---

## Séries temporelles (GTS)

L'application gère **25 GTS** réparties sur **5 modules × 5 types** :

| Module | Température | Pression | Atmosphère | Puissance | Status |
|---|---|---|---|---|---|
| Prometheus | ✅ | ✅ | ✅ | ✅ | ✅ |
| Nostromo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sulaco | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cheyenne | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auriga | ✅ | ✅ | ✅ | ✅ | ✅ |

### Types de données

| Type | Classe Warp10 | Unité | Valeurs |
|---|---|---|---|
| Température | `station.temperature` | celsius | 18–26 (double) |
| Pression | `station.pressure` | hPa | 1010–1016 (double) |
| Atmosphère | `station.atmosphere` | percent | 19–23 (double) |
| Puissance | `station.power` | kW | 10–80 (int) |
| Status | `station.status` | string | nominal / warning / critical |

---

## API Routes

### Capteurs

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Santé de l'application |
| `GET` | `/api/sensors` | Liste tous les capteurs |
| `POST` | `/api/sensors` | Crée un capteur |
| `GET` | `/api/sensors/:id` | Récupère un capteur |
| `PUT` | `/api/sensors/:id` | Modifie un capteur |
| `DELETE` | `/api/sensors/:id` | Supprime un capteur |

### Séries temporelles

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/gts/write` | Envoie une mesure à Warp10 |
| `GET` | `/api/gts/read` | Lit l'historique d'un capteur |
| `POST` | `/api/gts/simulate` | Simule N heures de données |
| `GET` | `/api/gts/analyze` | Statistiques WarpScript |

### Exemples

```bash
# Lister les capteurs
curl http://localhost:3000/api/sensors

# Créer un capteur
curl -X POST http://localhost:3000/api/sensors \
  -H 'Content-Type: application/json' \
  -d '{"name":"Capteur Test","type":"temperature","module":"Prometheus","unit":"celsius"}'

# Écrire une mesure
curl -X POST http://localhost:3000/api/gts/write \
  -H 'Content-Type: application/json' \
  -d '{"sensorId":"<id>","value":22.5}'

# Simuler 24h de données
curl -X POST http://localhost:3000/api/gts/simulate \
  -H 'Content-Type: application/json' \
  -d '{"hours":24}'

# Statistiques température
curl "http://localhost:3000/api/gts/analyze?type=temperature"

# Statistiques status
curl "http://localhost:3000/api/gts/analyze?type=status"
```

---

## Analyse WarpScript

L'endpoint `/api/gts/analyze` exécute du WarpScript sur Warp10 pour calculer :

### Types numériques (temperature, pressure, atmosphere, power)

- **Mean** — moyenne via `REDUCE reducer.mean`
- **Median** — 50ème percentile via `VALUES LSORT`
- **Q1** — 1er quartile (25ème percentile)
- **Q3** — 3ème quartile (75ème percentile)
- **P99** — 99ème percentile

### Type status

- **Distribution** — nombre de `nominal`, `warning`, `critical`
- **Health score** — score de santé en % (`nominal×100 + warning×50) / total`

---

## Pages

| URL | Description |
|---|---|
| `/` | Dashboard global avec les 5 modules et bouton simulation |
| `/sensors` | Gestion CRUD des capteurs avec toggle actif/inactif |
| `/modules/:module` | Vue détaillée d'un module avec stats et graphiques |
| `/stats` | Statistiques générales tous types et tous modules |

---

## WarpStudio

L'interface WarpStudio est accessible sur `http://localhost:8081`.

Exemple WarpScript pour explorer les données :

```warpscript
// Toutes les GTS des dernières 24h
[ 'READ_TOKEN' '~station.*' {} NOW 24 h ] FETCH

// Filtrer par module
[ 'READ_TOKEN' '~station.*' { 'module' 'Prometheus' } NOW 24 h ] FETCH

// Filtrer par type
[ 'READ_TOKEN' 'station.temperature' {} NOW 24 h ] FETCH
```

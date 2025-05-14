
Detta är ett REST-API som är byggt med Node.js, Express och MongoDB via Mongoose

Detta är ett REST-API byggt med Node.js, Express och MongoDB (via Mongoose) som lagrar arbetserfarenheter. Den har full CRUD-funktionalitet (Create, Read, Update, Delete) och returnerar data i JSON-format. Applikationen har stöd för CORS, som gör det möjligt att använda webbtjänsten från andra domäner.

När man startar servern mot en MongoDB Atlas-databas enligt URI:n i en `.env`-fil. En Mongoose-modell används för att skapa ett schema där varje erfarenhet innehåller företagsnamn, jobbtitel, anställningstid och en valfri beskrivning. Alla fält utom beskrivningen är obligatoriska och valideras innan datan sparas.

API-endpoints:
- GET/api/experiences** – hämtar alla arbetserfarenheter
- GET/api/experiences/:id** – hämtar en specifik erfarenhet med angivet ID
- POST/api/experiences** – skapar en ny erfarenhet (kräver alla obligatoriska fält)
- PUT/api/experiences/:id** – uppdaterar en erfarenhet med angivet ID
- DELETE/api/experiences/:id** – tar bort en erfarenhet med angivet ID

Ett erfarenhetsobjekt returneras som JSON med följande struktur:

```json
{
  "company": "EXE Företag",
  "role": "Senior Utvecklare",
  "duration": "2022–2023",
  "description": "Ansvarig för backend-utveckling."
}

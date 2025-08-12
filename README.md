# <img src="./frontend/public/favicon.ico" alt="Leadlift Logo" width="20"/> LeadLift: An AI-Powered Client Search Engine

LeadLift is an AI-powered lead generation tool built for digital marketing agencies. It compiles business data from 
various platforms on the Internet for finding and assessing prospective clients. The tool identifies potential clients 
based on a user’s desired search filters, scoring them based on several factors, and uses AI to summarize business 
presence and courses of action among other features. It includes a web frontend built with Next.js for user interaction.

---

## 🚀 Getting Set Up

1. **Clone the repository**
   ```
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Install frontend dependencies**
   ```
   cd frontend
   npm install
   ```

3. **Create a `.env` file** in the project root with the following keys:
   ```
   GOOGLE_API_KEY=<your-key>
   AI_API_KEY=<your-gemini-api-key>
   SIMILARWEB_API_KEY=<your-key>
   PROXYCRAWL_API_KEY=<your-key>
   CRAWLBASE_NAPI_KEY=<your-key>
   CRAWLBASE_JSAPI_KEY=<your-key>
   REDIS_URL=redis://localhost:6379/0
   JWT_SECRET_KEY=<your-secret>
   GAUTH_CLIENT_ID=<your-client-id>
   GAUTH_CLIENT_SECRET=<your-client-secret>
   ```

4. **Install Redis* (If not already installed)
   * [Download Redis](https://redis.io/downloads/)
   * If on **Windows**, make sure **WSL** is installed and running.

5. **Ensure Uvicorn is installed**
   ```
   pip install uvicorn
   ```

6. **Initialize the database**
   ```
   python backend/db/db_init.py
   ```

7. **Run the application**
   Open **two terminals**:

   * **Frontend** (Terminal 1):
     ```
     cd frontend
     npm run dev
     ```
   * **Backend** (Terminal 2):
     ```
     uvicorn backend.main:app --reload
     ```

8. **Access the app**
   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:8000](http://localhost:8000)

9. **Enjoy!**

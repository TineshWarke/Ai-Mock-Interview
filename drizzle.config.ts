import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.ts",
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_Yf1VtJcGaQ7w@ep-fancy-bonus-a8smfb00-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
    }
});

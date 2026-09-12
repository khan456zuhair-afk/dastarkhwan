/**
 * DASTARKHWAN — SERVER-SIDE ADMIN SEED SCRIPT
 * Run strictly server-side on your terminal:
 *   npx ts-node scripts/seed-admins.ts
 *
 * Requirements:
 *   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in your environment or .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local if exists
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...vals] = trimmed.split("=");
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  }
} catch {
  // Ignore
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder")) {
  console.error("❌ ERROR: Valid NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to run this script.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DESIGNATED_ADMINS = [
  {
    email: "admin.haider@dastarkhwan.internal",
    fullName: "Haider Khan (Operations Director)",
    tempPassword: "Dastarkhwan@Admin2026!Haider",
    role: "admin",
  },
  {
    email: "admin.bilal@dastarkhwan.internal",
    fullName: "Bilal Ustaad (Culinary & Inventory Lead)",
    tempPassword: "Dastarkhwan@Admin2026!Bilal",
    role: "admin",
  },
  {
    email: "admin.tariq@dastarkhwan.internal",
    fullName: "Tariq Farooq (Finance & POS Supervisor)",
    tempPassword: "Dastarkhwan@Admin2026!Tariq",
    role: "admin",
  },
];

async function seedAdmins() {
  console.log("👑 Dastarkhwan Multi-Admin Provisioning Starting...\n");

  for (const admin of DESIGNATED_ADMINS) {
    try {
      console.log(`Checking account for: ${admin.email}...`);

      // 1. Create or retrieve auth user
      const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: admin.email,
        password: admin.tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: admin.fullName,
          role: "admin",
          must_change_password: true,
        },
      });

      let userId = user?.user?.id;

      if (createError) {
        if (createError.message.toLowerCase().includes("already registered")) {
          console.log(`  ℹ️ User ${admin.email} already exists in auth.users.`);
          // Fetch existing user id
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existing = listData.users.find((u) => u.email === admin.email);
          userId = existing?.id;
        } else {
          console.error(`  ❌ Failed to create auth user for ${admin.email}:`, createError.message);
          continue;
        }
      } else {
        console.log(`  ✅ Auth user created successfully.`);
      }

      if (userId) {
        // 2. Set role to admin in public.profiles table
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: userId,
            email: admin.email,
            full_name: admin.fullName,
            role: "admin",
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error(`  ❌ Failed to assign admin role in profiles:`, profileError.message);
        } else {
          console.log(`  👑 Role 'admin' assigned in public.profiles.`);
        }
      }
    } catch (err) {
      console.error(`  ❌ Unexpected error provisioning ${admin.email}:`, err);
    }
  }

  console.log("\n✅ All 3 designated administrator accounts processed.");
  console.log("Admins can now log in at /admin/login using their designated credentials.");
}

seedAdmins();


import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Public by design: the anon key only allows inserts into `inquiries` and
// `audit_requests`, enforced by each table's row-level security policy.
var SUPABASE_URL = "https://tdqdrdojxtwoapfellgf.supabase.co";
var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcWRyZG9qeHR3b2FwZmVsbGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDI1NDksImV4cCI6MjEwNTU3ODU0OX0.EdjQbssG_KRDEveqJcQq12ujEOfwSHJqhfXKA7MdLIU";

export var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

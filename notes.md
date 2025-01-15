
## issue resolutions: 
- invalid PEM key for google drive config
    - Deno deploy seems to auto escape any env vars, so whatever you put in the box is not actually what they expose to the app(ffs)
    - had to use `private_key: Deno.env.get("GOOGLE_PRIV_KEY")!.replace(/\\n/g, '\n'),` to solve this
- migrations failing in github actions:
    - supabase give you ipv6 and ipv4 connection strings, and only ipv4 works on github actions
    - had to update my github action secrets to use the ipv4 connection details
- `SCRAM: server signature missing`
    - password on github actions does not need to be escaped


content = """[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_version = "20"
"""
with open('netlify.toml', 'wb') as f:
    f.write(content.encode('utf-8'))
print("Successfully created netlify.toml")

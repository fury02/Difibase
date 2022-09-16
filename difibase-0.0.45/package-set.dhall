
let upstream = https://github.com/dfinity/vessel-package-set/releases/download/mo-0.6.7-20210818/package-set.dhall sha256:c4bd3b9ffaf6b48d21841545306d9f69b57e79ce3b1ac5e1f63b068ca4f89957
let aviate-labs = https://github.com/aviate-labs/package-set/releases/download/v0.1.5/package-set.dhall sha256:8cfc64fd3c6e8aa93390819b5f96dfb064afb63817971bcc8d9aa00c312ec8ab

let Package = { name : Text, version : Text, repo : Text, dependencies : List Text }
let additions = [
  { name = "io"
  , repo = "https://github.com/aviate-labs/io.mo"
  , version = "v0.3.1"
  , dependencies = [ "base" ]
  },
  { name = "rand"
  , repo = "https://github.com/aviate-labs/rand.mo"
  , version = "v0.2.2"
  , dependencies = [ "base" ]
  },
  { name = "uuid"
  , version = "v0.2.0"
  , repo = "https://github.com/aviate-labs/uuid.mo"
  , dependencies = [ "base", "encoding", "io" ]
  },


  { name = "crypto"
  , repo = "https://github.com/aviate-labs/crypto.mo"
  , version = "v0.2.0"
  , dependencies = [ "base", "encoding" ]
  },
  { name = "encoding"
  , repo = "https://github.com/aviate-labs/encoding.mo"
  , version = "v0.3.2"
  , dependencies = [ "base", "array" ]
  },
  { name = "json"
  , repo = "https://github.com/aviate-labs/json.mo"
  , version = "v0.1.2"
  , dependencies = [ "base", "parser-combinators" ]
  },


  { name = "candy"
   , repo = "https://github.com/aramakme/candy_library.git"
   , version = "v0.1.5"
   , dependencies = ["base"]
   },
   { name = "principal"
   , repo = "https://github.com/aviate-labs/principal.mo.git"
   , version = "v0.1.1"
   , dependencies = ["base"]
   }
] : List Package

in  upstream # aviate-labs # additions
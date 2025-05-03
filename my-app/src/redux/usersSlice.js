
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/cookieUtils";


export const fetchAuthUser = createAsyncThunk(
  "user/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Não autenticado");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



// GET /users/partner/   ( parceiro do user)
export const fetchPartnerUser = createAsyncThunk(
  "user/partner",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:3000/users/partner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar parceiro");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// PUT /users/connect/:id       (liga parceiro)
export const connectPartner = createAsyncThunk(
  "user/connectPartner",
  async ({ _, code }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:3000/users/connect-partner`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );
      if (!res.ok) throw new Error("Erro ao ligar parceiro");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// GET /users/accessories      (acessórios que o user TEM)
export const fetchOwnedAccessories = createAsyncThunk(
  "user/fetchOwnedAccessories",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3000/users/accessories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar acessórios owned");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /users/accessories/equipped (acessórios equipados)
// (verifica qual é a rota correcta, se for /users/accessories-equipped)
export const fetchEquippedAccessories = createAsyncThunk(
  "user/fetchEquippedAccessories",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3000/users/accessories-equipped", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar acessórios equipados");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// PUT /users/:id               (editar user)
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:3000/users/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar utilizador");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /users/accessories/buy   (comprar acessório)
export const buyAccessory = createAsyncThunk(
  "user/buyAccessory",
  async ({ _, accessoryId }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3000/users/accessories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accessoryId }),
      });
      if (!res.ok) throw new Error("Erro ao comprar acessório");
      return await res.json(); // devolve, p.ex., { owned: [...], points: novoSaldo }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// PUT /users/accessories/equip  (acessório – string)  |  cor  (number)

  // PUT  /users/accessories/equip
 export const equipAccessories = createAsyncThunk(
  "user/equipAccessories",

 async ({ accessoryId, type }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      const body =
        type === "SkinColor"
          ? { color: accessoryId ?? null }     
          : { accessoryId: accessoryId ?? null };

      const res = await fetch(
        "http://localhost:3000/users/accessories/equip",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao equipar acessórios");
      }
      const data = await res.json();
      return data.accessoriesEquipped;          
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// —————————————————————————————————————————————————————
// 2) Slice & estado
// —————————————————————————————————————————————————————
const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    allUsers: [],
    partnerUser: null,
    ownedAccessories: [],
    equippedAccessories: { hat: null, shirt: null, color: null, background: null },
    status: "idle",
    error: null,
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAuthUser.pending, (s) => { s.status = "loading"; })
      .addCase(fetchAuthUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.authUser = a.payload;
      })
      .addCase(fetchAuthUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      .addCase(updateUser.fulfilled, (s, a) => {
        // substitui na lista de allUsers e em authUser, se for o mesmo
        const u = a.payload;
        s.authUser = s.authUser?._id === u._id ? u : s.authUser;
        s.allUsers = s.allUsers.map(x => x._id === u._id ? u : x);
      })

      //
      .addCase(fetchPartnerUser.fulfilled, (s, a) => {
        s.partnerUser = a.payload;
      })


      .addCase(connectPartner.fulfilled, (s, a) => {
        s.authUser = a.payload;
      })
   

      .addCase(fetchOwnedAccessories.fulfilled, (s, a) => {
        s.ownedAccessories = a.payload;
      })
      .addCase(fetchEquippedAccessories.fulfilled, (s, a) => {
        const { hat, shirt, color, background } = a.payload;
            s.equippedAccessories = {
            hat:        hat?.id         ?? null,   
            shirt:      shirt?.id       ?? null,
            color:      color           ?? null,
            background: background?.id  ?? null,
      };
      })

     
      .addCase(buyAccessory.fulfilled, (s, a) => {
     
        s.ownedAccessories = a.payload.owned;
        if (s.authUser) s.authUser.points = a.payload.points;
      })
      .addCase(equipAccessories.fulfilled, (state, action) => {
        state.equippedAccessories = action.payload;
      })
      .addCase(equipAccessories.rejected, (state, action) => {
        state.error = action.payload;
      });


  },
});

export default userSlice.reducer;

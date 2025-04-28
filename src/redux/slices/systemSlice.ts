import { SubCategory } from "@/helpers/types/category.types";
import { Post } from "@/helpers/types/post.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemData {
  systemData: SubCategory | null;
  post: Post | null;
}

const initialState: SystemData = {
  systemData: null,
  post: null,
};

const systemSlice = createSlice({
  name: "systemData",
  initialState,
  reducers: {
    setSystemData: (state, action: PayloadAction<SubCategory | null>) => {
      state.systemData = action.payload;
    },
    setPostData: (state, action: PayloadAction<Post | null>) => {
      state.post = action.payload;
    },
    clearSystemData: (state) => {
      state.systemData = null;
    },
    clearPostData: (state) => {
      state.post = null;
    },
  },
});

export const { setSystemData, clearSystemData, setPostData, clearPostData } =
  systemSlice.actions;
export default systemSlice.reducer;

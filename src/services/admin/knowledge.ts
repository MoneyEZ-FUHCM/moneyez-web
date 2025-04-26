import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/helpers/types/common.type";
import { Knowledge } from "@/helpers/types/knowledge.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const knowledgeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKnowledgeList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/knowledges?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<Knowledge>(response),
      providesTags: ["Knowledge"],
    }),
    uploadKnowledge: builder.mutation({
      query: (formData: FormData) => ({
        url: "/knowledges",
        method: HTTP_METHOD.POST,

        body: formData,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    deleteKnowledge: builder.mutation({
      query: (id) => ({
        url: `/knowledges/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Knowledge"],
    }),
  }),
});

export const {
  useGetKnowledgeListQuery,
  useUploadKnowledgeMutation,
  useDeleteKnowledgeMutation,
} = knowledgeApi;

export default knowledgeApi;

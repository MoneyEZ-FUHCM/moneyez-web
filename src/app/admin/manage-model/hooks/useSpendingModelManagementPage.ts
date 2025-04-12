import { CATEGORY_TYPE_TEXT, TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { getRandomColor } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen, setPlainText } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useGetCategoryListQuery } from "@/services/admin/category";
import {
  useAddCategoryModalToSpendingModelMutation,
  useCreateSpendingModelMutation,
  useDeleteSpendingModelMutation,
  useGetSpendingModelIdQuery,
  useGetSpendingModelListQuery,
  useRemovecategoryFromSpendingModelMutation,
  useUpdateSpendingModelContentMutation,
  useUpdateSpendingModelMutation,
} from "@/services/admin/spendingModel";
import {
  AddCategoryModelRequest,
  CategoryItem,
  ModelRecord,
  RemoveCategoryRequest,
} from "@/types/spendingModel.types";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_MODEL_CONSTANT } from "../model.constant";
import { TEXT_TRANSLATE } from "../model.translate";

const useSpendingModelManagementPage = () => {
  const { SYSTEM_ERROR, CONDITION } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_MODEL_CONSTANT;
  const { MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } = TEXT_TRANSLATE;

  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const confirm = Modal.confirm;
  const colorMapRef = useRef<Record<string, string>>({});

  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const plainText = useSelector((state: RootState) => state.modal.plainText);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isEditing, setIsEditing] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [editingPercentages, setEditingPercentages] = useState<
    Record<string, number>
  >({});
  const [isEditingAll, setIsEditingAll] = useState(false);

  const { data, isLoading: isLoadingModelList } = useGetSpendingModelListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const {
    data: spendingModel,
    isLoading,
    refetch,
  } = useGetSpendingModelIdQuery(id as string);

  const { data: categories } = useGetCategoryListQuery({
    PageIndex: 1,
    PageSize: 50,
    search: "",
  });

  const [createModel, { isLoading: isCreatingModel }] =
    useCreateSpendingModelMutation();
  const [updateSpendingModel] = useUpdateSpendingModelMutation();
  const [updateSpendingModelContent] = useUpdateSpendingModelContentMutation();
  const [deleteModel] = useDeleteSpendingModelMutation();
  const [
    addCategoryModalToSpendingModel,
    { isLoading: isAddCategoryModalToSpendingModel },
  ] = useAddCategoryModalToSpendingModelMutation();
  const [removecategoryFromSpendingModel] =
    useRemovecategoryFromSpendingModelMutation();

  const availableCategories = useMemo(() => {
    if (!categories?.items || !spendingModel?.data?.spendingModelCategories)
      return [];

    const existingCategoryIds = new Set(
      spendingModel.data.spendingModelCategories.map((item) => item.categoryId),
    );

    return categories.items.filter(
      (category) => !existingCategoryIds.has(category.id),
    );
  }, [categories?.items, spendingModel?.data?.spendingModelCategories]);

  const budgets = useMemo(() => {
    if (isEditingAll) {
      return (
        spendingModel?.data?.spendingModelCategories?.map((category) => {
          if (!colorMapRef.current[category.category.id]) {
            colorMapRef.current[category.category.id] = getRandomColor();
          }
          return {
            color: colorMapRef.current[category.category.id],
            percent: editingPercentages[category.categoryId] ?? 0,
            name: category.category.name,
            icon: category.category.icon,
          };
        }) || []
      );
    }

    return (
      spendingModel?.data?.spendingModelCategories?.map((category) => {
        if (!colorMapRef.current[category.category.id]) {
          colorMapRef.current[category.category.id] = getRandomColor();
        }
        return {
          color: colorMapRef.current[category.category.id],
          percent: category.percentageAmount,
          name: category.category.name,
          icon: category.category.icon,
        };
      }) || []
    );
  }, [
    spendingModel?.data?.spendingModelCategories,
    isEditingAll,
    editingPercentages,
  ]);

  const filteredCategories = useMemo(
    () =>
      spendingModel?.data?.spendingModelCategories.filter(
        (category) =>
          selectedType === "ALL" || category.category.type === selectedType,
      ),
    [spendingModel?.data?.spendingModelCategories, selectedType],
  );

  const breadcrumbItems = [
    {
      href: "/admin/manage-model",
      title: TITLE.MANAGE_MODEL,
    },
    {
      title: TITLE.MANAGE_MODEL_DETAIL,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        categories: [{ categoryId: undefined, percentageAmount: undefined }],
      });
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (spendingModel?.data?.spendingModelCategories) {
      const total = spendingModel.data.spendingModelCategories.reduce(
        (sum, item) => sum + item.percentageAmount,
        0,
      );
      setTotalPercentage(total);
    }
  }, [spendingModel?.data?.spendingModelCategories]);

  useEffect(() => {
    if (isEditingAll) {
      const total = Object.values(editingPercentages).reduce(
        (sum, value) => sum + (value || 0),
        0,
      );
      setTotalPercentage(total);
    }
  }, [editingPercentages, isEditingAll]);

  useEffect(() => {
    if (spendingModel?.data) {
      form.setFieldsValue({
        name: spendingModel.data.name,
        description: spendingModel.data.description || "",
      });
    }
  }, [spendingModel?.data, form]);

  const handleAddModel = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      const updateValue = [{ ...values, isTemplate: CONDITION.TRUE }];
      if (!plainText.trim()) {
        showToast(TOAST_STATUS.INFO, "Vui lòng nhập mô tả");
        return;
      }
      try {
        await createModel(updateValue).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
        dispatch(setPlainText(""));
      } catch (err: any) {
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        dispatch(setIsOpen(true));
      }
    } catch (err) {
      dispatch(setIsOpen(true));
    }
  };

  const handleCancel = (): void => {
    dispatch(setIsOpen(false));
    form.resetFields();
  };

  const handleOpenModalAdd = useCallback((): void => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const handlePageChange = (pagination: TablePaginationConfig): void => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleViewDetail = useCallback(
    (record: ModelRecord): void => {
      router.push(`/admin/manage-model/${record.id}`);
    },
    [router],
  );

  const handleDeleteModel = (id: number): void => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteModel(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
            );
            return;
          }
          if (error?.errorCode === ERROR_CODE.MODEL_HAS_DEPENDENCIES) {
            showToast(
              TOAST_STATUS.ERROR,
              "Mô hình đang được sử dụng. Không thể xóa ở thời điểm hiện tại",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleAddModelCategory = useCallback(
    async (spendingModelId: string, refetch: () => void): Promise<void> => {
      try {
        const values = await form.validateFields();

        try {
          const existingCategories =
            data?.items?.find((model) => model.id === spendingModelId)
              ?.spendingModelCategories || [];

          const hasExistingCategories = existingCategories.length > 0;

          const payload: AddCategoryModelRequest = {
            spendingModelId: spendingModelId,
            categories:
              values.categories?.length > 0 &&
              values.categories?.map((category: CategoryItem) => ({
                categoryId: category?.categoryId,
                percentageAmount: hasExistingCategories
                  ? category?.percentageAmount || 0
                  : category?.percentageAmount,
              })),
          };

          await addCategoryModalToSpendingModel(payload).unwrap();
          showToast(
            TOAST_STATUS.SUCCESS,
            "Thêm danh mục vào mô hình thành công",
          );
          handleCancel();

          refetch();
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.INVALID_TOTAL_PERCENTAGE) {
            showToast(
              TOAST_STATUS.ERROR,
              "Tổng giá trị ngân sách phải bằng 100%",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      } catch (err: any) {}
    },
    [data?.items, form, addCategoryModalToSpendingModel],
  );

  const handleRemoveSpendingModelCategory = useCallback(
    async (
      modelId: string,
      categoryId: string,
      refetch: () => void,
    ): Promise<void> => {
      confirm({
        title: TITLE.TITLE,
        content: TITLE.CONTENT,
        okText: TITLE.OK_TEXT,
        okType: "danger",
        cancelText: TITLE.CANCEL_TEXT,
        onOk: async () => {
          try {
            const requestData: RemoveCategoryRequest = {
              spendingModelId: modelId,
              categoryIds: [categoryId],
            };
            await removecategoryFromSpendingModel(requestData).unwrap();
            refetch();
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
          } catch (err: any) {
            const error = err?.data;
            if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
              showToast(
                TOAST_STATUS.ERROR,
                TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
              );
              return;
            }
            showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
          }
        },
      });
    },
    [
      confirm,
      removecategoryFromSpendingModel,
      TITLE,
      ERROR_CODE,
      MESSAGE_SUCCESS,
    ],
  );

  const handleViewDetailCategory = useCallback(
    (record: string): void => {
      router.push(`/admin/manage-category/${record}`);
    },
    [router],
  );

  const handleUpdateModel = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        id: id as string,
        name: values.name,
        description: values.description,
        isTemplate: true,
      };
      await updateSpendingModelContent(payload).unwrap();
      showToast(
        TOAST_STATUS.SUCCESS,
        "Cập nhật nội dung mô hình chi tiêu thành công",
      );
      setIsEditing(false);
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleUpdatePercentage = async () => {
    try {
      const categories = Object.entries(editingPercentages)
        .filter(([categoryId]) => {
          const category = spendingModel?.data?.spendingModelCategories.find(
            (item) => item.categoryId === categoryId,
          );
          return category?.category.type !== CATEGORY_TYPE_TEXT.INCOME;
        })
        .map(([categoryId, percentageAmount]) => ({
          categoryId,
          percentageAmount: Number(percentageAmount),
        }));

      const incomeCategories = spendingModel?.data?.spendingModelCategories
        .filter((item) => item.category.type === CATEGORY_TYPE_TEXT.INCOME)
        .map((item) => ({
          categoryId: item.categoryId,
          percentageAmount: item.percentageAmount,
        }));

      if (incomeCategories) {
        categories.push(...incomeCategories);
      }

      await updateSpendingModel({
        spendingModelId: id as string,
        categories,
      }).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Cập nhật mô hình chi tiêu thành công");

      setIsEditingAll(false);
      setEditingPercentages({});
    } catch (err: any) {
      const error = err?.data;
      if (error.errorCode === ERROR_CODE.INVALID_TOTAL_PERCENTAGE) {
        showToast(TOAST_STATUS.ERROR, "Tổng giá trị ngân sách phải bằng 100%");
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const getPercentageClass = (percentage: number) => {
    if (percentage === 100) return "font-medium text-green";
    if (percentage > 100) return "font-medium text-red";
    return "font-medium text-yellow-500";
  };

  return {
    state: {
      data,
      isLoadingModelList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingModel,
      isAddCategoryModalToSpendingModel,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      selectedType,
      isLoading,
      breadcrumbItems,
      spendingModel,
      isEditing,
      budgets,
      isEditingAll,
      totalPercentage,
      editingPercentages,
      availableCategories,
      filteredCategories,
      id,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddModel,
      handleCancel,
      handleDeleteModel,
      handleViewDetail,
      handleAddModelCategory,
      setSelectedType,
      handleRemoveSpendingModelCategory,
      handleViewDetailCategory,
      dispatch,
      setIsEditing,
      handleUpdateModel,
      handleUpdatePercentage,
      setIsEditingAll,
      setEditingPercentages,
      setTotalPercentage,
      getPercentageClass,
      refetch,
    },
  };
};

export { useSpendingModelManagementPage };

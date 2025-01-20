import { db } from "@/db";
import type { MulterBlobFile } from "@/types";
import { deleteBlob, downloadBlob, uploadBlob } from "@/utils/blob";
import { models } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";

export const getModels: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const where = and(getSearch([models.id, models.key, models.name], search));
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(models).where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(models, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(models)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched models successfully",
    data: {
      models: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const createModel: AppController = catchAsync(async (req, res) => {
  const multerFile = req.file as MulterBlobFile;
  if (!multerFile) {
    throw new AppError("No file was uploaded", StatusCodes.BAD_REQUEST);
  }
  const key = `${Date.now().toString()}-${multerFile.originalname}`;
  uploadBlob(key, multerFile);
  await db.insert(models).values({
    key,
    name: multerFile.originalname,
    mimetype: multerFile.mimetype,
    size: multerFile.size,
  });
  return res.status(StatusCodes.CREATED).json({
    message: "Model created successfully!",
    data: {
      key,
    },
  });
});

export const getModel: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Model id is required", StatusCodes.BAD_REQUEST);
  }
  const model = await db.query.models.findFirst({
    where: eq(models.id, id),
  });
  if (!model) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const response = await downloadBlob(model.key);
  if (!response.readableStreamBody) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const extension = model.name.split(".").pop();
  res.setHeader("Content-Disposition", `attachment; filename=${model.id}.${extension}`);
  res.setHeader("Content-Type", response.contentType || "application/octet-stream");
  response.readableStreamBody.pipe(res);
});

export const updateModelSchema = z.object({
  body: z.object({
    modelId: z.string(),
    name: z.string(),
  }),
});

export const updateModel: AppController = catchAsync(async (req, res) => {
  const { name, modelId } = req.body as z.infer<typeof updateModelSchema>["body"];
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const model = await db.query.models.findFirst({
    where: eq(models.id, modelId),
  });
  if (!model) {
    throw new AppError("Model not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(models)
    .set({
      name,
    })
    .where(eq(models.id, modelId));
  return res.status(StatusCodes.OK).json({
    message: "Updated model successfully",
  });
});

export const deleteModelSchema = z.object({
  body: z.object({
    modelId: z.string(),
  }),
});

export const deleteModel: AppController = catchAsync(async (req, res) => {
  const { modelId } = req.body as z.infer<typeof deleteModelSchema>["body"];
  const model = await db.query.models.findFirst({
    where: eq(models.id, modelId),
  });
  if (!model) {
    throw new AppError("Model not found", StatusCodes.NOT_FOUND);
  }
  deleteBlob(model.key);
  await db.delete(models).where(eq(models.id, modelId));
  return res.status(StatusCodes.OK).json({
    message: "Deleted model successfully",
  });
});

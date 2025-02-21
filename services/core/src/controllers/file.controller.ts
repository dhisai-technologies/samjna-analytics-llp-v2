import { db } from "@/db";
import type { MulterBlobFile } from "@/types";
import { deleteBlob, getBlobUrl, uploadBlob } from "@/utils/blob";
import { files, users } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";

export const getFiles: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const where = and(getSearch([files.id, files.key, files.name, users.email], search), eq(files.isAnalytics, false));
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: files.id,
        key: files.key,
        name: files.name,
        mimetype: files.mimetype,
        size: files.size,
        createdAt: files.createdAt,
        updateAt: files.updatedAt,
        userId: users.id,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(files)
      .innerJoin(users, eq(users.id, files.userId))
      .where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(files, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(files)
      .innerJoin(users, eq(users.id, files.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(files)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched files successfully",
    data: {
      files: result.map((file) => ({ ...file, users: undefined, user: file.users })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getAnalyticsVideoFiles: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const where = and(
    getSearch([files.id, files.key, files.name], search),
    eq(files.isAnalytics, true),
    eq(files.mimetype, "video/webm"),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: files.id,
        key: files.key,
        name: files.name,
        mimetype: files.mimetype,
        size: files.size,
        createdAt: files.createdAt,
        updateAt: files.updatedAt,
      })
      .from(files)
      .where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      getSort(files, sorting, {
        column: "createdAt",
        order: "desc",
      }),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(files)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(files)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched files successfully",
    data: {
      files: result.map((file) => ({ ...file, link: getBlobUrl(file.key) })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const uploadFiles: AppController = catchAsync(async (req, res) => {
  const multerFiles = req.files as MulterBlobFile[];
  const { isPublic, isAnalytics } = req.query;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  if (multerFiles.length === 0) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const keys = [] as string[];
  for (const file of multerFiles) {
    const key = `${Date.now().toString()}-${file.originalname}`;
    uploadBlob(key, file);
    await db.insert(files).values({
      key,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      userId: req.user.id,
      isPublic: isPublic === "true",
      isAnalytics: isAnalytics === "true",
    });
    keys.push(key);
  }
  return res.status(StatusCodes.OK).json({
    message: "Files uploaded successfully!",
    data: {
      keys,
    },
  });
});

export const uploadAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const multerFile = req.file as MulterBlobFile;
  if (!multerFile) {
    throw new AppError("No file was uploaded", StatusCodes.BAD_REQUEST);
  }
  const key = `${Date.now().toString()}-${multerFile.originalname}`;
  console.log("Uploading file", key, req.body);
  const { uid, count } = req.body as {
    uid: string;
    count: string;
  };
  uploadBlob(key, multerFile);
  await db.insert(files).values({
    key,
    name: `${uid}-${count}-${multerFile.originalname}`,
    mimetype: multerFile.mimetype,
    size: multerFile.size,
    userId: "",
    isPublic: false,
    isAnalytics: true,
  });
  return res.status(StatusCodes.OK).json({
    message: "File uploaded successfully!",
    data: {
      key,
    },
  });
});

export const getFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const url = getBlobUrl(file.key);
  return res.status(StatusCodes.OK).json({
    message: "Fetched file successfully",
    data: { url, file },
  });
});

export const getFileFromKey: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("File key is required", StatusCodes.BAD_REQUEST);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.key, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const url = getBlobUrl(file.key);
  return res.status(StatusCodes.OK).json({
    message: "Fetched file successfully",
    data: { url, file },
  });
});

export const updateFileSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const updateFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body as z.infer<typeof updateFileSchema>["body"];
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  if (file.userId !== req.user.id) {
    throw new AppError("You are not authorized to update this file", StatusCodes.UNAUTHORIZED);
  }
  await db
    .update(files)
    .set({
      name,
    })
    .where(eq(files.id, id));
  return res.status(StatusCodes.OK).json({
    message: "Updated file successfully",
  });
});

export const deleteFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  if (file.userId !== req.user.id && req.user.role !== "ADMIN") {
    throw new AppError("You are not authorized to delete this file", StatusCodes.UNAUTHORIZED);
  }
  deleteBlob(file.key);
  await db.delete(files).where(eq(files.id, id));
  return res.status(StatusCodes.OK).json({
    message: "Deleted file successfully",
  });
});

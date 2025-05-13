import { HttpException, HttpStatus } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { extname } from "path";
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";

/**
 * Multer configuration object specifying the destination folder.
 */
export const multerConfig = {
  dest: "public"
};

/**
 * Generates a unique filename using UUID and preserves the file extension.
 * 
 * @param file - The incoming file object from Multer
 * @returns A new unique filename with original extension
 */
function uuidRandom(file) {
  const result = `${uuid()}${extname(file.originalname)}`;
  return result;
}

/**
 * Multer options including file filtering and custom storage configuration.
 */
export const multerOptions = {
  /**
   * Filters uploaded files to allow only specific image types.
   *
   * @param req - Express request object
   * @param file - File object from Multer
   * @param cb - Callback function to indicate acceptance or rejection
   */
  fileFilter(req: any, file: any, cb: any) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
  },

  /**
   * Custom storage configuration using diskStorage.
   * - Creates the upload directory if it doesn't exist.
   * - Sets a UUID-based filename for each uploaded file.
   */
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, uuidRandom(file));
    }
  })
};

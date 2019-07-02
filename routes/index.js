const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images");
  },
  filename: (req, res, cb) => {
    cb(null, "macdfile" + path.extname(res.originalname));
  }
});

const upload = multer({ storage: storage });

const azure = require("azure-storage");
const blobService = azure.createBlobService(
  "dwirandyhstorage",
  "BroTUHppCPOC5DKxC+hMFxFoYxGJu9hR4s3JEwcRxXO7UtKoFcLT4npIk5LkHuDF0pYkAx6+WKrE7X7CZfvOQQ=="
);

const containerName = "macdsubmission";
const blobName = "macdsubmission";
const fileName = `${__dirname}/../public/images/macdfile.jpg`;

/* GET home page. */
router.get("/", function(req, res, next) {
  const viewData = {
    title: "AZURE STORAGE & COGNITIVE SERVICE"
  };
  if (req.query.msg) {
    viewData.msg = req.query.msg;
  }
  res.render("index", viewData);
});

router.post("/result", upload.single("image"), (req, res) => {
  blobService.createContainerIfNotExists(
    containerName,
    {
      publicAccessLevel: "blob"
    },
    function(error, result, response) {
      if (!error) {
        blobService.createBlockBlobFromLocalFile(
          containerName,
          "blobmacd",
          fileName,
          function(error, result, response) {
            if (!error) {
              return res.redirect(
                "/?msg=File berhasil terupload ke azure storage"
              );
            } else {
              return res.json({ msg: error.message });
            }
          }
        );
      } else {
        return res.json({ msg: error.message });
      }
    }
  );
});

router.get("/upload", upload.single("image"), function(req, res, next) {
  blobService.createContainerIfNotExists(
    containerName,
    {
      publicAccessLevel: "blob"
    },
    function(error, result, response) {
      if (!error) {
        blobService.createBlockBlobFromLocalFile(
          containerName,
          "blobmacd",
          fileName,
          function(error, result, response) {
            if (!error) {
              return res.json({ msg: "Blob upload successfully" });
            } else {
              return res.json({ msg: error.message });
            }
          }
        );
      } else {
        return res.json({ msg: error.message });
      }
    }
  );
});

router.get("/image", function(req, res) {
  res.render("image", {
    imageUrl:
      "https://dwirandyhstorage.blob.core.windows.net/macdsubmission/blobmacd"
  });
});

module.exports = router;

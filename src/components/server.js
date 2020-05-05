import * as S3 from "aws-sdk/clients/s3";

export const createBlog = (blog) => {
  console.log("S3 called o");
  uploadItem(blog, blog.owner);
};

async function uploadItem(item, owner) {
  //Check if file exist
  let items = [];
  //Key
  const bucket = new S3({
    accessKeyId: "AKIA3UZA6DLJHL3ABW6C",
    secretAccessKey: "A8isoIAep0K1qW+lChHwPNVeoymgq/+xygJNwknY",
    //region: 'YOUR-REGION'
  });
  //Key

  const params = {
    Bucket: "onome",
    Key: "" + owner,
  };
  try {
    const data = await bucket.getObject(params).promise();
    items = JSON.parse(data.Body.toString());
    items.push(item);
    storeInS3(items, owner + "");
  } catch (err) {
    if (err.code === "NoSuchKey") {
      items.push(item);
      storeInS3(items, owner + "");
    } else if (err.code === "NetworkingError") {
      console.log("Please check your network");
    }
  }
}

function storeInS3(items, owner) {
  const contentType = "application/json";

  //Key
  const bucket = new S3({
    accessKeyId: "AKIA3UZA6DLJHL3ABW6C",
    secretAccessKey: "A8isoIAep0K1qW+lChHwPNVeoymgq/+xygJNwknY",
    //region: 'YOUR-REGION'
  });
  //Key
  let file = JSON.stringify(items);
  const params = {
    Bucket: "onome",
    Key: owner,
    Body: file,
    ACL: "public-read",
    ContentType: contentType,
  };
  bucket
    .upload(params, function (err, data) {})
    .promise()
    .then((data) => {})
    .catch((error) => {});
}

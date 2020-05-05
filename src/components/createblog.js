import React, { useState, useEffect, useRef, useReducer } from "react";
import "../components/blog.css";
import upload from "../icons/upload.jpg";
import picture from "../icons/interface.png";
import electronics from "../icons/electronics.png";
import brush from "../icons/brush.png";
import Messages from "../components/messages";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "@tinymce/tinymce-react";
import { ProgressSpinner } from "primereact/progressspinner";
// import entire SDK
import * as S3 from "aws-sdk/clients/s3";
//const userContext = useContext(UserContext);

function CreateBlog() {
  const [blogPost, setBlogPost] = useState("<p>Create New Blog post</p>");
  const [category, setCategory] = useState("Love & Relationship");
  const [title, setTitle] = useState("");
  const [front, setFront] = useState(upload);
  const [changeVClass, setChangeVClass] = useState("col-5");
  const [changeWClass, setChangeWClass] = useState("col-7");
  const [message, setMessage] = useState("");
  const [briefDes, setBriefDes] = useState("");
  const [loading, setLoading] = useState(false);

  const [msgCode, setMsgCode] = useState(0);
  const [initVideo, setInitVideo] = useState(
    "https://www.youtube.com/embed/JwoV1-ykm9E?rel=0"
  );
  const [onPicture, setOnPicture] = useState(true);

  const handleEditorChange = (e) => {
    setBlogPost(e.target.getContent());
    console.log("Content was updated:", blogPost);
  };

  useEffect(() => {
    //console.log(new Date().getTime());
  }, []);

  function filterYoutubeVideo(e) {
    let sub = e.target.value + "";
    let key = sub.indexOf("?v=");
    console.log(`filter ${sub} ${key} `);
    if (key > 0) {
      let videoLink = `https://www.youtube.com/embed/${sub.substring(key + 3)}`;
      setInitVideo(videoLink);
    }
  }

  function createNewBlog(e) {
    setLoading(true);
    e.preventDefault();
    if (onPicture) {
      if (front === upload) {
        setMessage("Please Upload Display Picture");
        setMsgCode(3);
        setLoading(false);
      } else if (title.length < 5) {
        setMessage("Please set a proper Title");
        setMsgCode(4);
        setLoading(false);
      } else {
        const blog = {
          postId: `${new Date().getTime()}${title}`,
          title: title,
          isVideo: false,
          display: front,
          author: "Nzegbuna M",
          briefDes: briefDes,
          avatar: "",
          post: blogPost,
          date: new Date().toDateString(),
          owner: "Nzegbuna",
        };
        let result = createBlog(blog);
        console.log(JSON.stringify(result));
      }
    } else {
      if (initVideo === "https://www.youtube.com/embed/JwoV1-ykm9E?rel=0") {
        setMessage("Please add a valid Youbube video Link");
        setMsgCode(4);
        setLoading(false);
      } else if (title.length < 5) {
        setMessage("Please set a proper Title");
        setMsgCode(4);
        setLoading(false);
      } else {
        const blog = {
          postId: `${new Date().getTime()}${title}`,
          title: title,
          isVideo: true,
          display: initVideo,
          author: "Nzegbuna M",
          briefDes: briefDes,
          avatar: "",
          post: blogPost,
          date: new Date().toDateString(),
          owner: "Nzegbuna",
        };
        let result = createBlog(blog);
        console.log(JSON.stringify(result));
      }
    }
  }

  const SelectCategory = [
    { label: "Love & Relationship", value: "Love & Relationship" },
    { label: "Health", value: "Health" },
    { label: "Karma", value: "Karma" },
    { label: "Religion", value: "Religion" },
    { label: "Quote", value: "Quote" },
    { label: "Marriage", value: "Marriage" },
    { label: "Self Improvement", value: "Self Improvement" },
  ];

  const fileInput = useRef();

  //Call Server

  function createBlog(blog) {
    uploadItem(blog, blog.owner);
  }

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
      console.log(`no of post ${items.length}`);
      items.push(item);
      storeInS3(items, owner + "");
    } catch (err) {
      if (err.code === "NoSuchKey") {
        items.push(item);
        storeInS3(items, owner + "");
      } else if (err.code === "NetworkingError") {
        setMsgCode(4);
        setMessage("Please check your network");
        setLoading(false);
      } else {
        setMsgCode(4);
        setMessage("Something went wrong");
        setLoading(false);
      }
    }
  }

  function onUpload(e) {
    setLoading(true);
    let selecetdFile = e.target.files[0];
    let x = selecetdFile.type + "";
    let fileType = x.substr(x.indexOf("/") + 1) + "";
    let isfile = new RegExp("jpeg|png|gif|jpg").test(fileType);
    if (isfile) {
      const file = selecetdFile;
      const filename = file.name;
      console.log(filename);
      const contentType = file.type;
      const bucket = new S3({
        accessKeyId: "AKIA3UZA6DLJHL3ABW6C",
        secretAccessKey: "A8isoIAep0K1qW+lChHwPNVeoymgq/+xygJNwknY",
        //region: 'YOUR-REGION'
      });
      const params = {
        Bucket: "onomepixs",
        Key: filename + "",
        Body: file,
        ACL: "public-read",
        ContentType: contentType,
      };

      bucket
        .upload(params, function (err, data) {})
        .promise()
        .then((data) => {
          let pix = `https://onomepixs.s3.us-east-2.amazonaws.com/${filename}`;
          setFront(pix);
          setMessage("");
          setMsgCode(0);
          setLoading(false);
        })
        .catch((error) => {
          setMessage(
            `Some thing went wrong.Please check your network or ${error}`
          );
          setMsgCode(4);
          setLoading(false);
        });
    } else {
      setMessage("File not an Image");
      setMsgCode(4);
      setLoading(false);
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
      .then((data) => {
        setMessage("Blog Created Successfully");
        setMsgCode(2);
        setLoading(false);
        /* userContext.userDispatch({
          type: "GLOBAL_MSG",
          message: "",
          msgCode: 2,
        });*/
      })
      .catch((error) => {
        setMessage("Some thing went wrong .Please try again");
        setMsgCode(4);
        setLoading(false);
      });
  }

  //Call Server

  return (
    <div className="App">
      <Editor
        initialValue={blogPost}
        init={{
          height: 500,
          menubar: true,
          content_css:
            "//https://onomevideos.s3.us-east-2.amazonaws.com/blog.css?" +
            new Date().getTime(),
          plugins: [
            "advlist autolink lists link image",
            "charmap print preview anchor help",
            "searchreplace visualblocks code",
            "insertdatetime media table paste wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic | underline | image code | \
            alignleft aligncenter alignright blockquote | \
            bullist numlist outdent indent | help",
          /* without images_upload_url set, Upload tab won't show up*/
          images_upload_url: "https://onomepixs.s3.us-east-2.amazonaws.com",
          /* we override default upload handler to simulate successful upload*/
          images_upload_handler: function (blobInfo, success, failure) {
            const file = blobInfo.blob();
            const filename = file.name;
            const contentType = file.type;
            const bucket = new S3({
              accessKeyId: "AKIA3UZA6DLJHL3ABW6C",
              secretAccessKey: "A8isoIAep0K1qW+lChHwPNVeoymgq/+xygJNwknY",
              //region: 'YOUR-REGION'
            });
            const params = {
              Bucket: "onomepixs",
              Key: filename + "",
              Body: file,
              ACL: "public-read",
              ContentType: contentType,
            };
            setTimeout(function () {
              bucket
                .upload(params, function (err, data) {})
                .promise()
                .then((data) => {
                  success(
                    "https://onomepixs.s3.us-east-2.amazonaws.com" +
                      "/" +
                      filename
                  );
                })
                .catch((error) => {
                  console.log(
                    `blob Info ${file.size} file name ${filename} file type ${file.type}`
                  );
                  failure(
                    `Some thing went wrong.Please check your network or ${error}`
                  );
                });
            }, 5000);
          },
        }}
        onChange={handleEditorChange}
      />
      <div className="config">
        <div className="row">
          <div className="col">
            <hr></hr>
          </div>
          <div className="col-auto">
            <h3>Configure Article</h3>
          </div>
          <div className="col">
            <hr></hr>
          </div>
        </div>
      </div>
      <div>
        <Messages message={message} msgCode={msgCode}></Messages>
      </div>
      <div className="articles">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="article_icon">
                <img
                  onClick={(e) => {
                    setOnPicture(true);
                    setChangeVClass("col-5");
                    setChangeWClass("col-7");
                  }}
                  src={picture}
                />{" "}
                <img
                  onClick={(e) => {
                    setOnPicture(false);
                    setChangeVClass("col-7");
                    setChangeWClass("col-5");
                  }}
                  src={electronics}
                />
                {loading ? (
                  <ProgressSpinner
                    style={{ width: "30px", height: "30px", float: "right" }}
                    strokeWidth="5"
                    fill="transparent"
                    animationDuration=".5s"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className={changeVClass}>
              {onPicture ? (
                <div className="config_block">
                  <input
                    style={{ display: "block" }}
                    type="file"
                    onChange={onUpload}
                    ref={fileInput}
                  />
                  <img src={front} onClick={() => fileInput.current.click()} />
                </div>
              ) : (
                <div className="config_block">
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      className="embed-responsive-item"
                      src={initVideo}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <InputTextarea
                    rows={1}
                    value={initVideo}
                    onChange={(e) => setInitVideo(e.target.value)}
                    onBlur={filterYoutubeVideo}
                    placeholder={`Add a video link i.e ${initVideo}`}
                    autoResize={true}
                    cols={30}
                  />
                </div>
              )}
            </div>
            <div className={changeWClass}>
              <div className="row">
                <div className="col-12">
                  <InputTextarea
                    rows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Title"
                    autoResize={true}
                    cols={30}
                  />
                </div>

                <div className="col-12">
                  <InputTextarea
                    rows={5}
                    value={briefDes}
                    onChange={(e) => setBriefDes(e.target.value)}
                    placeholder="Brief Descrition"
                    autoResize={true}
                    cols={30}
                  />
                </div>

                <div className="col-12">
                  <Dropdown
                    value={category}
                    options={SelectCategory}
                    onChange={(e) => {
                      setCategory(e.value);
                    }}
                  />
                </div>
                <div className="col-12">
                  <div className="push_btn">
                    <button
                      type="button"
                      onClick={createNewBlog}
                      className="btn btn-sm"
                    >
                      Create Blog <img src={brush} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;

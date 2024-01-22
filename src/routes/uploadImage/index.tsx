import { useState, useEffect } from 'react'
import { Divider, Image, message, Upload } from 'antd'
import { FileImageOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.css'

const getBase64 = (img: any,callback: Function) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload =(file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

export default function UploadImage() {

  const [imageList, setImageList] = useState([])
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getImageList()
  }, [])

  /**
   * 获取图片列表
   */
  const getImageList = () => {
    axios.post('http://localhost:4000/upload/findAllImage')
    .then(res => {
      if(res.data) {
        setImageList(res.data)
      }
    })
  }

  /**
   * 上传图片的按钮
   */
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  /**
   * 上传图片后，更新展示图片
   * @param info 上传图片的信息
   * @returns 
   */
  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, () => {
        setLoading(false);
        setImg(`http://localhost:4000/images/` + info.file.response.filename);
        getImageList()
      });
    }
  };

  /**
   * 点击图片列表中的某一项时，更新Image组件
   * @param imageName 图片名称
   * @returns 
   */
  const getImage = (imageName: string) => {
    return () => {
      setImg(`http://localhost:4000/images/` + imageName);
    }
  }
 
  return (
    <div className='PageList'>
      <div className='pageLeft'>
        <div className='leftHeader'>XinBuilder</div>
        <div className='leftDiscribe'>图片管理平台</div>
        <Divider />
        <div>
          {
            imageList.map((item, index) => {
              return <div style={img.includes(item) ?  {backgroundColor:'#edeaeb'} : {}} onClick={getImage(item)} key={index} className='imageItem'>
                <FileImageOutlined style={{marginRight:'10px'}}/>
                {item}
              </div>
            })
          }
        </div>
      </div>
      <div className='imageRight'>
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          action={`http://localhost:4000/upload/album`}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {
            uploadButton
          }
        </Upload>
        <Image
          width={500}
          src={img}
        />
      </div>
    </div>
  )
}

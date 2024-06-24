import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Button,Input, message, Modal,Divider, Select  } from 'antd';
import {DeleteOutlined,DatabaseOutlined,FormOutlined,InsertRowBelowOutlined,UsergroupDeleteOutlined} from '@ant-design/icons';
import axios from 'axios'
import './index.css'
const { Search } = Input

interface PageJson {
  pageName: string,
  pageId: string,
  pageJson: {
    [key: string]: any
  },
  _id: string
}

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageList, setPageList] = useState<PageJson []>()
  const [isModalOpen,setIsModalOpen] = useState<boolean>(false)
  const [pageName,setPageName] = useState<string>('')
  const [searchValue,setSearchValue] = useState<string>('')

  useEffect(() => {
    getPageList()
  }, [])

  /**
   * 获取全部List的接口
   */
  const getPageList = () => {
    axios.post(`http://localhost:4000/page-json/findAllPage`)
    .then(res => {
      setPageList(res.data.data)
    })
    .catch(err => {
      messageApi.open({
        type: 'error',
        content: '获取页面列表失败',
      });
    })
  }

  /**
   * 更改搜索框的内容
   * @param value 搜索框的内容
   */
  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  /**
   * 新建页面的弹窗
   */
  const addNewPage = () => {
    setIsModalOpen(true);
    setPageName('')
  }

  /**
   * 搜索内容的过滤
   * @param list 页面列表
   * @returns 过滤后的页面列表
   */
  const getSearchList = (list: PageJson [] | undefined) => {
    return (list || []).filter(item => {
      return item.pageName.indexOf(searchValue) > -1
    })
  }

  /**
   * 根据页面ID进行删除
   * @param pageId 页面的ID
   * @returns 
   */
  const deletePage = (pageId: string) => {
    return () => {
      axios.post(`http://localhost:4000/page-json/deletePage`,{
        pageId
      })
      .then(res => {
        messageApi.open({
          type: 'success',
          content: '删除成功',
        });
        getPageList()
      })
      .catch(err => {
        messageApi.open({
          type: 'error',
          content: '删除失败',
        });
      })
    }
  }

  /**
   * 新增页面掉的接口
   */
  const handleOk = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    axios.post(`http://localhost:4000/page-json/addPage`,{
      pageName: pageName,
      pageId:'pageInfo_' + new Date().getTime(),
      pageJson: {},
    })
    .then(res => {
      messageApi.open({
        type: 'success',
        content: '新建页面成功',
      });
      getPageList()
      setIsModalOpen(false)
    })
    .catch(err => {
      messageApi.open({
        type: 'error',
        content: '新建页面失败',
      });
    })
  }

  /**
   * 新建页面弹窗的取消回调
   */
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  /**
   * 更改输入的页面名称
   * @param e 页面名称
   */
  const changePageName = (e: any) => {
    setPageName(e.target.value)
  }

  /**
   * 根据页面ID跳转到详情页
   * @param pageId 页面ID
   * @returns 
   */
  const toBuilderPage = (pageId: string) => {
    return () => {
      window.open(`http://localhost:3000?pageId=${pageId}`)
    }
  }

  const toRenderPage = (pageId: string) => {
    return () => {
      window.open(`http://localhost:3000/render?pageId=${pageId}`)
    }
  }

  const upLoadImage = () => {
    window.open(`http://localhost:3001/#/uploadImage`)
  }

  const toDataBase = () => {
    window.open(`http://localhost:3001/#/dataBase`)
  }

  

  return (
    <div className='PageList'>
      {contextHolder}
      <div className='pageLeft'>
        <div className='leftHeader'>XinBuilder</div>
        <div className='leftDiscribe'>轻量级的低代码平台</div>
        <Divider />
        <Button onClick={upLoadImage} size='large' type='link'>图片管理</Button>
        <Divider />
        <Button onClick={toDataBase} size='large' type='link'>数据库管理</Button>
        <Divider />
      </div>
      <div className='pageRight'>
        <div className='PageHeader'>
          <Search
            style={{ width: 304 }}
            onSearch={onSearch}
          />
          <Button className='pageButton' onClick={addNewPage}>新建页面</Button>
        </div>
        <Divider />
        <div className='PageBody'>
          <Row style={{width:'100%'}} gutter={16}>
            {
              (getSearchList(pageList) || []).map(item => {
                return <Col style={{marginTop:'10px'}} key={item._id} span={6}>
                  <Card
                    title={<div><span>{item.pageName || '匿名'}</span><DeleteOutlined onClick={deletePage(item.pageId)}style={{float:'right',cursor:'pointer'}} /></div>}
                    bordered={false}
                    headStyle={{fontSize:'14px'}}
                  >
                    <div style={{height:'50px'}}>
                      <Button type='text' onClick={toBuilderPage(item.pageId)}>编辑页面</Button>
                      <Button type='text' onClick={toRenderPage(item.pageId)}>预览页面</Button>
                    </div>
                  </Card>
                </Col>
              })
            }
          </Row>
        </div>
      </div>
      <Modal title="创建页面" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='创建' cancelText='取消'>
          <Input addonBefore="页面名称" value={pageName} onChange={changePageName} />
      </Modal>
    </div>
  )
}

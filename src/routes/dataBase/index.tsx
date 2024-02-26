import { useEffect, useState } from 'react';
import { Button, Divider, Table, message, Modal, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

export interface IDataBaseProps {

}

interface Entity {
  entityCode: string,
  entityName: string,
  entitySchema: EntitySchema
}

interface EntitySchema {
  [key: string]: string
}

export default function DataBase (props: IDataBaseProps) {

  const [entityList, setEntityList] = useState<Entity []>([])
  const [entity, setEntity] = useState<Entity>()
  const [columns, setColumns] = useState<any []>()
  const [showEntityModal, setShowEntityModal] = useState<boolean>(false)
  const [schemaList, setSchemaList] = useState<any []>([])
  const [entityCode, setEntityCode] = useState<string>('')
  const [entityName, setEntityName] = useState<string>('')
  const [entityData, setEntityData] = useState<any []>([])

  useEffect(() => {
    getEntityList()
  }, [])

  useEffect(() => {
    const columns = getColumns();
    setColumns(columns)
    dealEntityData();
  }, [entity])

  const getEntityList = () => {
    axios.post('http://localhost:4000/entity/getEntityList')
    .then(res => {
      if(res.data.data) {
        setEntityList(res.data.data)
      }
    })
  }

  const getColumns = () => {
    const entitySchema = entity?.entitySchema || {};
    return ( Object.keys(entitySchema)|| []).map(propName => {
      return {
        title: propName,
        dataIndex: propName,
        key: propName
      }
    })
  }

  const dealEntityData = () => {
    axios.post('http://localhost:4000/entity/getEntityData', {
      entityCode: entity?.entityCode
    })
    .then(res => {
      if(res.data.data) {
        setEntityData(res.data.data)
      }
    })
  }

  const deleteEntity = (entity: Entity) => {
    return () => {
      axios.post('http://localhost:4000/entity/delEntityItem', {
        entityCode: entity.entityCode
      })
      .then(res => {
        if(res.data.code == 200) {
          message.success('删除成功');
          getEntityList()
        }
      })
    }
  }

  const addEntity = () => {
    setShowEntityModal(true)
  }

  const handleOk = () => {
    if(entityName === '' || entityCode === '') {
      message.error('请输入实体名称或编码')
      return;
    }
    const entitySchema: EntitySchema = {};
    schemaList.forEach(item => {
      if(item && item.code) {
        entitySchema[item.code] = item.type
      }
    })
    axios.post('http://localhost:4000/entity/addEntity', {
      entitySchema,
      entityCode,
      entityName
    })
    .then(res => {
      if(res.data.code = 200) {
        message.success('新建成功');
        getEntityList()
        setEntityName('')
        setEntityCode('')
        setSchemaList([])
        setShowEntityModal(false)
      }
    })
    
  }

  const handleCancel = () => {
    setEntityName('')
    setEntityCode('')
    setSchemaList([])
    setShowEntityModal(false)
  }

  return (
    <div className='PageList'>
      <div className='pageLeft'>
        <div className='leftHeader'>XinBuilder</div>
        <div className='leftDiscribe'>数据库管理平台</div>
        <Divider />
        <div>
          {
            entityList.map((item, index) => {
              return <div
                style={item.entityCode === entity?.entityCode ?  {backgroundColor:'#edeaeb'} : {}}
                onClick={() => {setEntity(item)}}
                key={index}
                className='imageItem'
              >
                {item.entityName}
                <DeleteOutlined onClick={deleteEntity(item)} style={{position:'relative', left: '230px', cursor:'pointer'}}/>
              </div>
            })
          }
        </div>
      </div>
      <div>
        
          <Button type='primary' onClick={addEntity} style={{marginTop:'100px', marginLeft:'25px'}}>新增实体</Button>
          <Table
            style={{width: 1300, marginTop:'20px', marginLeft:'20px'}}
            columns={columns}
            dataSource={entityData}
          />
      </div>
      <Modal
        title="新增实体"
        open={showEntityModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Button onClick={() => {setSchemaList([...schemaList, {}])}} style={{position:'relative', left:"550px", marginBottom:'20px'}} type='primary'>新增一行</Button>
        <div style={{display:'flex', width:'600px', justifyContent:'space-between'}}>
          <div style={{display:'flex', width:'280px', justifyContent:'space-around'}}>
            <p>实体名称:</p>
            <Input onChange={(e) => setEntityName(e.target.value)} style={{height:'30px', width:'180px', marginTop:'10px'}}/>
          </div>
          <div style={{display:'flex', width:'280px', justifyContent:'space-around'}}>
            <p>实体编码:</p>
            <Input onChange={(e) => setEntityCode(e.target.value)} style={{height:'30px', width:'180px', marginTop:'10px'}}/>
          </div>
        </div>
        <Divider />
        {
          schemaList.map((item, index) => {
            return <div key={index} style={{display:'flex', width:'600px', justifyContent:'space-between'}}>
              <div style={{display:'flex', width:'280px', justifyContent:'space-around'}}>
                <p>code:</p>
                <Input onChange={(e) => item.code = e.target.value} style={{height:'30px', width:'180px', marginTop:'10px'}}/>
              </div>
              <div style={{display:'flex', width:'280px', justifyContent:'space-around'}}>
                <p>type:</p>
                <Input onChange={(e) => item.type = e.target.value} style={{height:'30px', width:'180px', marginTop:'10px'}}/>
              </div>
            </div>
          })
        }
      </Modal>
    </div>
  )
}

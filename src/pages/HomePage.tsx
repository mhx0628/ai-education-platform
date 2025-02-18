import React from 'react'
import { ConfigProvider, Space, Row, Col, Card } from 'antd'
import 'antd/dist/reset.css'

const features = [
  {
    title: "学习社区",
    description: "丰富的在线课程资源，自由选择学习路径",
    icon: "https://via.placeholder.com/150"
  },
  {
    title: "学科闯关",
    description: "系统化知识体系，趣味化学习方式",
    icon: "https://via.placeholder.com/150"
  },
  {
    title: "作品创作",
    description: "激发创意潜能，展示个人才华",
    icon: "https://via.placeholder.com/150"
  },
  {
    title: "成长档案",
    description: "全面记录学习历程，可视化成长轨迹",
    icon: "https://via.placeholder.com/150"
  }
]

const HomePage = () => {
  return (
    <ConfigProvider>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '60px 20px'
      }}>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          {/* 主标题 */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '48px', color: '#fff' }}>AI未来教育平台</h1>
            <div style={{ fontSize: '24px', color: '#d4d4d4', marginTop: '10px' }}>智慧教育 · 创新未来</div>
          </div>

          {/* 核心功能入口 */}
          <Row gutter={[24, 24]} justify="center">
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card 
                  title={feature.title} 
                  hoverable 
                  style={{ transition: 'transform 0.3s ease' }}
                >
                  <img src={feature.icon} alt="feature icon" style={{ width: '100%', height: 'auto' }} />
                  <p>{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </div>
    </ConfigProvider>
  )
}

export default HomePage

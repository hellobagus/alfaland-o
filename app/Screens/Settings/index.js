import React from 'react'
import {Container,Content,Button,Text,H3} from 'native-base'

export default Settings = () => (
    <Container>
        <Content>
            <H3 style={nbStyles.subtitle}>
                Settings
            </H3>
        </Content>
    </Container>
)

const nbStyles = {
    subtitle :{
        textAlign : 'center'
    }
}
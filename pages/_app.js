import * as React from 'react'
import NextApp from 'next/app'
import '../styles/app.css'
import '@hackclub/theme/fonts/reg-bold.css'
import theme from '@hackclub/theme'
import { ThemeProvider, Flex } from 'theme-ui'
import ForceTheme from '../components/ForceTheme'
import Flag from '../components/Flag'
import LocaleSwitcher from '../components/LocaleSwitcher'
import NProgress from '../components/NProgress'
import Fullstory from '../components/Fullstory'
import Plausible from '../components/Plausible'
import Meta from '@hackclub/meta'
import Head from 'next/head'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Meta
          as={Head}
          name="Transfer Hack Club" // site name
          title="Transfer Hack Club" // page title
          description="Hack Club is a global nonprofit network of high school coding clubs. Apply now to start yours—we’ll provide support, curriculum, community, stickers, and more." // page description
          image="https://apply.hackclub.com/card_1.png" // large summary card image URL
          color="#ec3750" // theme color
        />
        <Fullstory />
        <Plausible />
        <Flag />
        <LocaleSwitcher />
        <NProgress color={'#ec3750'} />
        <ForceTheme theme="light" />
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
}

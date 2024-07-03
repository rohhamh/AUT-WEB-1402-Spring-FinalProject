'use client'

import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Alert,
  Snackbar,
  AlertTitle,
  Avatar,
  Divider
} from '@mui/material'

import React, { useEffect, useState } from 'react'
import { axios } from '@/utils'
import { AxiosError } from 'axios'
import moment from 'moment'

import { useRouter } from 'next/navigation'
import { User } from '@/types/user'

export default function Profile() {
  const [alertError, setAlertError] = useState<string>('')
  const [userInfo, setUserInfo] = useState<User>()

  const router = useRouter()

  useEffect(() => {
    getMe().then((data) => {
      setUserInfo(data)
    })
  }, [])

  return (
    <>
      <Container>
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', alignItems: 'center' }} >
          <Avatar sx={{ width: 110, height: 110 }} >
            <Typography component='h1' variant='h2'>
              {userInfo?.username?.[0]}
            </Typography>
          </Avatar>
          <Divider orientation='vertical' variant="middle" />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 10px 10px 10px', marginTop: '10px' }} >
            <Typography component='h1' variant='h3'>
              @{userInfo?.username}
            </Typography>
            <Divider />
            <Typography component='center' variant='h5' justifyContent='right' display='flex'>
              {userInfo?.email}
            </Typography>
            <Typography component='center' variant='overline' justifyContent='right' display='flex'>
              Joined {moment(userInfo?.createdAt).format('MMM YYYY')}
            </Typography>
          </Box>
        </Box>
      </Container>
      {alertError && (
        <Snackbar
          open={!!alertError}
          autoHideDuration={3000}
          onClose={() => setAlertError('')}
        >
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            {alertError}
          </Alert>
        </Snackbar>
      )}
    </>
  )

  async function getMe(): Promise<User | undefined> {
    try {
      return (await axios.get('/me')).data
    } catch (e: AxiosError | any) {
      if (e.response?.status === 401) {
        router.push('/auth-login')
        return
      }
      setAlertError(e.response?.data?.message || e.message)
    }
  }
}

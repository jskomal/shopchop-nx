import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { TAPIList } from '../../types'

import { supabase } from '../../utils'

type SingleListServerSideProps = {
  post: TAPIList
}

function SingleList({ post }: SingleListServerSideProps) {
  const [list, setList] = useState(post)
  const [errorMessage, setErrorMessage] = useState('')

  if (!post) {
    return <p>{errorMessage}</p>
  }

  return <div>{list.name}</div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data: MyLists, error } = await supabase
    .from('MyLists')
    .select('*')
    .eq('id', context.query.id)

  if (MyLists) {
    return {
      props: {
        post: MyLists[0],
        error: error?.message || '',
      },
    }
  } else {
    return { props: { post: [] } }
  }
}

export default SingleList

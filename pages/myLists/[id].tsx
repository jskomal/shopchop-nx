import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { TAPIList } from '../../types'

import { supabase } from '../../utils'

function SingleList() {
  const [list, setList] = useState<TAPIList>()
  const [errorMessage, setErrorMessage] = useState('')

  const {
    query: { id, post },
  } = useRouter()

  useEffect(() => {
    if (typeof post === 'string') {
      setList(JSON.parse(post))
    }
  }, [])

  if (!list) {
    return <p>{errorMessage}</p>
  }

  return <div>{list.name}</div>
}

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

// export async function getStaticProps() {
// let { data: MyLists, error } = await supabase
//   .from('MyLists')
//   .select('*')
//   .eq('id', context)

//   return {
//     props: {
//       list: context,
//     },
//   }
// }

export default SingleList

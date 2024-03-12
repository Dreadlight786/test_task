'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Date from "@/app/components/Date"

export default function Home() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState('')
  const [pagesCount, setPagesCount] = useState('')

  const changePage = (e) => {
    window.location.href = e.target.getAttribute('href')
  }

  useEffect(() => {
    let paramsPage = parseInt(searchParams.get('page'));
    paramsPage = isNaN(paramsPage) ? 1 : paramsPage;
    setPage(paramsPage)
    fetch(`http://127.0.0.1:8000/api/articles/?page=${paramsPage}`, {cache: 'no-store'})
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.items)
        setPagesCount(Math.ceil(data.count / 10))
      }).catch((error) => {
        throw new Error('Failed to fetch data');
      });
  }, [])

  return (
    <div className="flex flex-col items-center mt-2 p-4">
      <h1 className="text-4xl">Last articles</h1>

      <dl className="text-gray-900 w-full max-w-7xl">
        {articles.map(article =>
          <div className="p-6 bg-white border border-gray-600 rounded-lg shadow mt-4" key={article.id}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{article.title}</h5>

            <p className="mb-3 font-normal text-gray-700">{article.description}</p>

            <Link className="mb-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" href={`/articles/${article.slug}`}>
              Read
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>

            <p className="font-normal text-xs text-gray-700"><Date dateString={article.created_at} /></p>
          </div>
        )}
      </dl>

      <dl className="text-gray-900 flex gap-2 mt-7">
        {Array.from({length: pagesCount}, (_, i) => i + 1).map(index =>
          index == page ?
          <button className="text-sm size-7 grid place-items-center font-medium text-center text-white rounded-lg bg-blue-800 cursor-auto" key={index} disabled>{index}</button>
          :
          <button className="text-sm size-7 grid place-items-center font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" key={index} href={`/?page=${index}`} onClick={changePage}>{index}</button>
        )}
      </dl>
    </div>
  );
}

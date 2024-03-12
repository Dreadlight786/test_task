'use client'
import Link from 'next/link'
import Image from 'next/image'
import Date from "@/app/components/Date"
import CommentForm from "@/app/components/CommentForm"

async function getArticles(slug) {
    const endpoint = `http://127.0.0.1:8000/api/articles/${slug}`
    const res = await fetch(endpoint, {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

async function getComments(slug) {
    const endpoint = `http://127.0.0.1:8000/api/article_comments/${slug}`
    const res = await fetch(endpoint, {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function Article({ params }) {
    const [article, comments] = await Promise.all([getArticles(params.slug), getComments(params.slug)])
    // const article = await getArticel(params.slug)
    // const comments = await getComments(params.slug)

    return (
        <div className="flex flex-col items-center mt-2 p-4">
            <Link className="block m-auto mb-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" href={`/`}>To home page</Link>

            <article className="mx-auto w-full max-w-7xl format format-sm sm:format-base lg:format-lg format-blue border-b-4 border-gray-600 mb-20">
                <header className="mb-4 lg:mb-6 not-format">
                    <address className="flex items-center mb-6 not-italic">
                        <div className="inline-flex items-center mr-3 text-sm text-gray-900">
                            <Image
                                src="/user.jpg"
                                className="mr-4 rounded-full"
                                width={64}
                                height={64}
                                alt="Picture of the author"
                            />

                            <div>
                                <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">{article.author.username}</a>
                                <p className="text-base text-gray-500"><Date dateString={article.created_at} /></p>
                            </div>
                        </div>
                    </address>
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white lg:mb-6 lg:text-4xl">{article.title}</h1>
                </header>

                <p className="mb-2">{article.text}</p>
            </article>

            <section className="w-full max-w-7xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">Discussion</h2>
                </div>

                {comments.map(comment =>
                    <article className="p-6 mb-6 text-base bg-white border-b-2 border-gray-600" key={comment.id}>
                        <footer className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900">
                                    <Image
                                        src="/user.jpg"
                                        className="mr-4 rounded-full"
                                        width={24}
                                        height={24}
                                        alt="Picture of the author"
                                    />{comment.author.username}
                                </p>
                                <p className="text-sm text-gray-600"><Date dateString={comment.created_at} /></p>
                            </div>
                        </footer>
                        <p>{comment.text}</p>
                    </article>
                )}
                
                <CommentForm id={article.id}/>
            </section>
        </div>
    )
}
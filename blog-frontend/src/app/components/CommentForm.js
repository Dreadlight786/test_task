'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

export default function CommentForm(props) {
    const id = props.id
    const [authUsername, setAuthUsername] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [formLoaded, setFormLoaded] = useState(false)
    const [commentText, setCommentText] = useState('')
    const router = useRouter()

    useEffect(() => {
        const endpoint = "http://localhost:8000/api/who_am_i/"
        fetch(endpoint, { method: 'GET', credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    setAuthUsername(data.username)
                } else {
                    console.log(data.message);
                }

                setFormLoaded(true)
            })
    }, [])
    

    const closeLoginModal = (e) => {
        e.preventDefault();
        if (e.target == document.getElementById('my_modal_1')) {
            document.getElementById('my_modal_1').close()
        }
    }

    const closeRegistrationModal = (e) => {
        e.preventDefault();
        if (e.target == document.getElementById('my_modal_2')) {
            document.getElementById('my_modal_2').close()
        }
    }

    function handleLoginSubmit(e) {
        e.preventDefault()

        const endpoint = "http://localhost:8000/api/login/"
        const body = {
            username: username,
            password: password
        }
        fetch(endpoint, { method: 'POST', body: JSON.stringify(body), credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    setAuthUsername(data.username)
                } else {
                    alert(data.message);
                }
            })
    }

    function handleRegistrationSubmit(e) {
        e.preventDefault()

        const endpoint = 'http://localhost:8000/api/registration/'
        const body = {
            username: username,
            password: password,
            password_confirm: passwordConfirm,
        }
        fetch(endpoint, { method: 'POST', body: JSON.stringify(body), credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    setAuthUsername(data.username)
                } else {
                    alert(data.message);
                }
            })
    }

    function sendComment(e) {
        e.preventDefault()
        
        const endpoint = `http://localhost:8000/api/comments/`
        const body = {
            article_id: id,
            text: commentText
        }
        fetch(endpoint, { method: 'POST', body: JSON.stringify(body), credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.author.username) {
                    setCommentText('');
                    router.refresh()
                } else {
                    alert(data.message);
                }
            })
    }

    return (
        <div>
            {
                formLoaded ?
                (authUsername == '' ?
                <div>
                    <h3 className="mb-2">Sign in to leave a comment</h3>

                    <div className="flex gap-2">
                        <button className="mb-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            onClick={() => document.getElementById('my_modal_1').showModal()}>
                            Sign in
                        </button>

                        <button className="mb-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            onClick={() => document.getElementById('my_modal_2').showModal()}>
                            Sign up
                        </button>
                    </div>

                    <dialog id="my_modal_1" className="modal" onClick={closeLoginModal}>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="modal-box">
                                <div className="form-control mb-4">
                                    <div className="label">
                                        <label htmlFor="username" className="label-text">Username</label>
                                    </div>

                                    <input type="text" name="username" id="username" className="input input-bordered w-full" required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <div className="label">
                                        <label htmlFor="password" className="label-text">Password</label>
                                    </div>

                                    <input type="password" name="password" id="password" className="input input-bordered w-full" required
                                        value={password}
                                        onChange={(e) => {setPassword(e.target.value)}}
                                    />
                                </div>

                                <button type="submit" onClick={handleLoginSubmit} className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </dialog>

                    <dialog id="my_modal_2" className="modal" onClick={closeRegistrationModal}>
                        <form onSubmit={handleRegistrationSubmit}>
                            <div className="modal-box">
                                <div className="form-control mb-4">
                                    <div className="label">
                                        <label htmlFor="username" className="label-text">Username</label>
                                    </div>

                                    <input type="text" name="username" id="username" className="input input-bordered w-full" required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <div className="label">
                                        <label htmlFor="password" className="label-text">Password</label>
                                    </div>

                                    <input type="password" name="password" id="password" className="input input-bordered w-full" required
                                        value={password}
                                        onChange={(e) => {setPassword(e.target.value)}}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <div className="label">
                                        <label htmlFor="password_confirm" className="label-text">Confirm Password</label>
                                    </div>

                                    <input type="password" name="password_confirm" id="password_confirm" className="input input-bordered w-full" required
                                        value={passwordConfirm}
                                        onChange={(e) => {setPasswordConfirm(e.target.value)}}
                                    />
                                </div>

                                <button type="submit" onClick={handleRegistrationSubmit} className="btn btn-primary">Registration</button>
                            </div>
                        </form>
                    </dialog>
                </div>
                :
                <form onSubmit={sendComment} className="mb-6">
                    <p className="text-white mb-1">Leave coment as: <span className="font-bold">{authUsername}</span></p>

                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment" rows="6" value={commentText} onChange={(e) => {setCommentText(e.target.value)}}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 resize-none dark:bg-white"
                            placeholder="Write a comment..." required></textarea>
                    </div>
                    <button type="submit"
                        onClick={sendComment}
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-primary-800">
                        Post comment
                    </button>
                </form>)
                :
                <div></div>
            }
        </div>
    )
}
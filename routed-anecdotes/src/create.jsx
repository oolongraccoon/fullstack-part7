
import  { useField } from './hooks/index'

export const CreateNew = (props) => {
    const { reset: resetContent, ...content } = useField('text')
    const { reset: resetAuthor, ...author } = useField('text')
    const { reset: resetInfo, ...info } = useField('text')
    
    
    const handleSubmit = (e) => {
        e.preventDefault()
        props.addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0
        })
    }
    const handleReset = (e) => {
        e.preventDefault()
        resetContent()
        resetAuthor()
        resetInfo()
    } 

    return (
        <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
            <div>
            content
            <input {...content} />
            </div>
            <div>
            author
            <input {...author} />
            </div>
            <div>
            url for more info
            <input {...info} />
            </div>
            <button type='submit'>create</button>
            <button type='reset' onClick={handleReset}>reset</button>
        </form>
        </div>
    )
    
    }
      
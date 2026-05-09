import React, { useEffect, useState } from 'react'

const App = () => {

  // Stores input title
  const [title, setTitle] = useState("")

  // Stores input detail
  const [detail, setDetail] = useState("")

  // Tracks which note is being edited
  const [editIndex, setEditIndex] = useState(null)

  // Theme state stored in localStorage
  // If saved theme exists it loads automatically after refresh
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme !== null) {
      return JSON.parse(savedTheme)
    }

    return true
  })

  // Notes state stored in localStorage
  // Loads previous notes when app starts
  const [task, setTask] = useState(() => {
    const storedTask = localStorage.getItem("notes")

    if (storedTask) {
      return JSON.parse(storedTask)
    }

    return []
  })

  // Runs whenever task changes
  // Saves notes into browser localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(task))
  }, [task])

  // Runs whenever theme changes
  // Saves dark/light mode into localStorage
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode))
  }, [darkMode])

  // Handles Add + Update note functionality
  const submitHandler = (e) => {
    e.preventDefault()

    // Prevent empty note submission
    if (!title.trim() || !detail.trim()) {
      return
    }

    const copyTask = [...task]

    // Updates existing note
    if (editIndex !== null) {
      copyTask[editIndex] = {
        title,
        detail,
        date: task[editIndex].date
      }

      setEditIndex(null)

    } else {

      // Adds new note with current date/time
      copyTask.push({
        title,
        detail,
        date: new Date().toLocaleString()
      })
    }

    setTask(copyTask)

    // Clears input fields after submission
    setTitle("")
    setDetail("")
  }

  // Deletes selected note
  const deleteNote = (idx) => {
    const copyTask = [...task]

    copyTask.splice(idx, 1)

    setTask(copyTask)
  }

  // Fills form inputs with selected note data
  const editNote = (idx) => {
    setTitle(task[idx].title)
    setDetail(task[idx].detail)

    setEditIndex(idx)
  }

  // Toggles between dark and light mode
  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  return (

    // Main app container with dynamic theme styling
    <div
      className={`min-h-screen px-6 py-10 transition-all duration-500 ${
        darkMode
          ? "bg-zinc-950 text-white"
          : "bg-zinc-100 text-black"
      }`}
     >

      <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-10'>

        {/* ================= FORM SECTION ================= */}

        <div
          className={`rounded-3xl p-8 shadow-2xl border transition-all duration-500 ${
            darkMode
              ? "bg-zinc-900 border-zinc-800"
              : "bg-white border-zinc-300"
          }`}
         >

          <h1 className='text-4xl font-bold mb-2 tracking-tight'>
            Notes App
          </h1>

          <p
            className={`mb-8 ${
              darkMode
                ? "text-zinc-400"
                : "text-zinc-600"
            }`}
          >
            Create and manage your personal notes
          </p>

          <form
            onSubmit={submitHandler}
            className='flex flex-col gap-5'
           >

            {/* Dynamic themed input field */}
            <input
              type="text"
              placeholder='Enter Notes Title'

              className={`w-full px-5 py-3 rounded-2xl border
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
              outline-none transition-all duration-300
              ${
                darkMode
                  ? "bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-zinc-100 border-zinc-300 text-black placeholder:text-zinc-400"
              }`}

              value={title}

              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />

            {/* Dynamic themed textarea */}
            <textarea
              placeholder='Enter Details'

              className={`w-full h-40 px-5 py-4 rounded-2xl border
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
              outline-none resize-none transition-all duration-300
              ${
                darkMode
                  ? "bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-zinc-100 border-zinc-300 text-black placeholder:text-zinc-400"
              }`}

              value={detail}

              onChange={(e) => {
                setDetail(e.target.value)
              }}
            />

            {/* Button changes text during edit mode */}
            <button
              className='w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600
              hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30
              active:scale-[0.98] transition-all duration-300
              font-semibold tracking-wide'
            >
              {editIndex !== null ? "Update Note" : "Add Note"}
            </button>

          </form>
        </div>

        {/* ================= NOTES SECTION ================= */}

        <div
          className={`rounded-3xl p-8 shadow-2xl border transition-all duration-500 ${
            darkMode
              ? "bg-zinc-900 border-zinc-800"
              : "bg-white border-zinc-300"
          }`}
         >

          {/* Header with notes count + theme toggle */}
          <div className='flex items-center justify-between mb-8'>

            <h1 className='text-4xl font-bold tracking-tight'>
              Your Notes
            </h1>

            <div className='flex items-center gap-4'>

              <span
                className={`px-4 py-1 text-sm rounded-full ${
                  darkMode
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {task.length} {task.length === 1 ? "Note" : "Notes"}
              </span>

              <button
                onClick={toggleTheme}

                className='px-5 py-2 rounded-xl
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-semibold
                hover:scale-105 transition-all duration-300'
              >
                {darkMode ? "☀" : "🌙"}
              </button>

            </div>
          </div>

          {/* Scrollable notes container */}
          <div className='flex flex-wrap gap-6 overflow-y-auto max-h-[70vh]'>

            {/* Empty state if no notes exist */}
            {task.length === 0 ? (

              <div className='w-full flex items-center justify-center py-20'>

                <p
                  className={`text-xl ${
                    darkMode
                      ? "text-zinc-500"
                      : "text-zinc-600"
                  }`}
                >
                  No Notes Yet
                </p>

              </div>

             ) : (

              task.map((elem, idx) => {

                return (

                  // Dynamic note card
                  <div
                    key={idx}

                    className={`relative w-full sm:w-60 min-h-60 rounded-3xl p-5 border
                    hover:-translate-y-2 hover:border-blue-500
                    transition-all duration-300 shadow-lg
                    ${
                      darkMode
                        ? "bg-zinc-800 border-zinc-700"
                        : "bg-zinc-100 border-zinc-300"
                    }`}
                  >

                    <h2
                      className={`text-xl font-bold mb-3 text-center break-words ${
                        darkMode
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {elem.title}
                    </h2>

                    <p
                      className={`text-sm leading-relaxed break-words ${
                        darkMode
                          ? "text-zinc-300"
                          : "text-zinc-700"
                      }`}
                    >
                      {elem.detail}
                    </p>

                    {/* Shows note creation date */}
                    <p
                      className={`text-xs mt-5 ${
                        darkMode
                          ? "text-zinc-500"
                          : "text-zinc-500"
                      }`}
                    >
                      {elem.date}
                    </p>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteNote(idx)}

                      className='absolute top-4 right-3 h-8 w-8 rounded-full
                      bg-red-500 hover:bg-red-600
                      flex items-center justify-center
                      text-white font-bold text-sm
                      shadow-lg hover:scale-110 active:scale-95
                      transition-all duration-300'
                    >
                      ✕
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => editNote(idx)}

                      className='absolute top-4 left-3 h-8 px-3 rounded-full
                      bg-blue-500 hover:bg-blue-600
                      flex items-center justify-center
                      text-white text-xs font-bold
                      shadow-lg hover:scale-105
                      transition-all duration-300'
                    >
                      Edit
                    </button>

                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
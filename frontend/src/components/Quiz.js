import React, { useEffect } from 'react'
import { useState } from 'react'

export default function Quiz({Data}) {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [chosenOption, setChosenOption] = useState(null);

    useEffect(() => {
        setChosenOption(null);
    }, [currentQuestion])


    return (
        <div className='quiz'>
            <h3>{currentQuestion + 1}. {Data[currentQuestion].question}</h3>
            {chosenOption == null &&
                <ol>
                    {Data[currentQuestion].choices.map((c, c_index) => (<li key={c_index} onClick={() => { setChosenOption(c_index) }}>
                        {c}
                    </li>))}
                </ol>
            }
            {chosenOption != null && <>
                {chosenOption == Data[currentQuestion].correct_answer && <span style={{color: "green"}}>You are correct!</span>}
                {chosenOption != Data[currentQuestion].correct_answer && <span style={{color: "red"}}>Wrong!</span>}
                <br />
                The correct answer is {Data[currentQuestion].choices[Data[currentQuestion].correct_answer]}
                <br />
                <button type="button" onClick={()=>{setCurrentQuestion((currentQuestion+1) % Data.length)}}>Next</button>
            </>}
        </div>
    )
}

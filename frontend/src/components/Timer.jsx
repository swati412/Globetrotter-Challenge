import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Timer = ({onTimeUp}) => {
    const maxQuestionTime = useSelector((state) => state.game.maxQuestionTime);
    const questionStartTime = useSelector((state) => state.game.questionStartTime);
    const selectedOption = useSelector((state) => state.game.selectedOption);

    const [timeLeft, setTimeLeft] = useState(maxQuestionTime)
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let timerId;
        if(isRunning && questionStartTime && !selectedOption){
            timerId = setInterval(() => {
                const elaspedTime = (Date.now() - questionStartTime) / 1000
                const remaining = Math.max(0, maxQuestionTime - elaspedTime)
                setTimeLeft(remaining.toFixed(1))
                if(remaining <= 0){
                    setIsRunning(false);
                    if(onTimeUp) onTimeUp();
                }
            }, 100);
        }

        return () => {
            if(timerId) clearInterval(timerId);
        }
    },[isRunning, questionStartTime, maxQuestionTime, selectedOption, onTimeUp])

    useEffect(() => {
        if(selectedOption !== null){
            setIsRunning(false);
        }
    }, [selectedOption])
    
    return (
        <div className="mb-6">
            {console.log(timeLeft)}
                <div className='flex justify-between items-center'>
                    <span className=''>Time Remaining</span>
                    <span>{timeLeft}</span>
                </div>
        </div>
    )
}

export default Timer
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { questions } from '../../data/questions';
import { createEntry } from '@/lib/actions';

export default function Home() {
  const TIME_ALLOWED = 60; // 1 minute
  const [timeLeft, setTimeLeft] = useState(TIME_ALLOWED);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const timerRef = useRef<HTMLElement>(null);
  const timeoutCalledRef = useRef(false);

  const formRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(0);
  let form_cards: NodeListOf<Element>;

  useEffect(() => {
    if (!formRef.current) return;

    form_cards = (formRef.current as HTMLElement).querySelectorAll(
      '.form_card'
    );

    // Cleanup interval on unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  function updateTimer() {
    setTimeLeft((prevTimeLeft) => {
      if (prevTimeLeft > 0) {
        if (prevTimeLeft <= 10) timerRef.current?.classList.add('warning');
        return prevTimeLeft - 1;
      } else {
        clearInterval(intervalRef.current);

        if (!timeoutCalledRef.current) {
          // timeOut();
          timeoutCalledRef.current = true;
        }

        return prevTimeLeft;
      }
    });
  }

  function onClickNext(e: any) {
    e.preventDefault();

    const button = e.target as HTMLButtonElement;
    const card = button.parentElement as HTMLElement;

    const inputs = card.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      const inp = inputs[i] as HTMLInputElement;
      const isValid = inp.reportValidity();
      if (!isValid) return;
    }

    setCurrentCard(currentCard + 1);

    // start timer
    intervalRef.current = setInterval(updateTimer, 1000);
  }

  function onFormSubmit(e: FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    /* if (form === (formRef.current! as HTMLFormElement))
      return console.error('Form mismatch error'); */

    let correctCount = 0;
    const questions = form.querySelectorAll('input[type="radio"]');

    for (let q = 0; q < questions.length; q) {
      correctCount += Number(
        (questions[q] as HTMLInputElement).dataset.isCorrect!
      );
    }

    console.log(correctCount);

    const formData = new FormData(form);

    const first_name = formData.get('first_name');
    const last_name = formData.get('last_name');
  }

  return (
    <main>
      <div className='title'>
        <h1>Demo Form</h1>
        <p>
          This is a form demo. Complete the quiz (it's biology) within 1 minute
          and get a score.
        </p>
      </div>

      <div className='timer_wrapper'>
        <span>Time left: </span>
        <span id='time_left' ref={timerRef}>
          {timeLeft}
        </span>
        <span> seconds</span>
      </div>

      <form
        id='quiz_form'
        action=''
        method='POST'
        onSubmit={(e) => onFormSubmit(e)}
        ref={formRef}
      >
        <div className='form_card'>
          <div className='input_wrapper'>
            <label htmlFor='first_name'>First Name</label>
            <input type='text' name='first_name' id='first_name' required />
          </div>

          <div className='input_wrapper'>
            <label htmlFor='last_name'>Last Name</label>
            <input type='text' name='last_name' id='last_name' required />
          </div>

          <button
            type='button'
            form='quiz_form'
            onClick={(e) => onClickNext(e)}
          >
            Next
          </button>
        </div>

        <div className='form_card'>
          <div className='questions_wrapper'>
            {questions &&
              questions.en.map((q, q_index) => (
                <div className='radio_wrapper' key={'question_' + q_index}>
                  <span className='question'>{q.question}</span>

                  {q.answers.map((a, a_index) => (
                    <div
                      className='answer'
                      key={'q' + q_index + '_answer' + a_index}
                    >
                      <input
                        type='radio'
                        value={a.answer}
                        name={'question_' + q_index}
                        id={'q' + q_index + '_answer' + a_index}
                        data-is-correct={a.isCorrect}
                        required
                      />
                      <label htmlFor={'q' + q_index + '_answer' + a_index}>
                        {a.answer}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <button type='submit' form='quiz_form'>
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

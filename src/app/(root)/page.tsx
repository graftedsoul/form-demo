'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { questions } from '../../data/questions';
import { createEntry } from '@/lib/actions';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import Spinner from './Spinner';

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

  useEffect(() => {
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

    const viewLink = document.getElementById('view_link') as HTMLElement;
    viewLink.classList.remove('lightcoral');
    viewLink.classList.add('blue');

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

  useEffect(() => updateCard(currentCard), [currentCard]);

  function updateCard(card: number) {
    if (!formRef.current) return;

    const form_cards = (formRef.current as HTMLElement).querySelectorAll(
      '.form_card'
    );

    form_cards[card].scrollIntoView();
  }

  function handleChange(e: ChangeEvent) {
    console.log('Change event fired');
    const radio = e.target as HTMLInputElement;
    const radio_group = document.getElementsByName(radio.name);

    for (let i = 0; i < radio_group.length; i++) {
      (radio_group[i] as HTMLInputElement).removeAttribute('checked');
    }

    radio.setAttribute('checked', 'true');
  }

  async function onFormSubmit(e: FormEvent) {
    e.preventDefault();

    clearInterval(intervalRef.current);

    // result page
    const result = document.getElementById('result') as HTMLElement;
    result.scrollIntoView();

    const viewLink = document.getElementById('view_link') as HTMLElement;
    viewLink.classList.remove('lightcoral');
    viewLink.classList.remove('blue');
    viewLink.classList.add('dark');

    const form = e.target as HTMLFormElement;

    let correctCount = 0;
    const questions = form.querySelectorAll(
      'input[type="radio"][checked="true"]'
    );

    for (let q = 0; q < questions.length; q++) {
      correctCount += Number(
        (questions[q] as HTMLInputElement).dataset.isCorrect!
      );
    }

    console.log(questions);
    console.log(correctCount);

    const formData = new FormData(form);

    const first_name = formData.get('first_name')!.toString();
    const last_name = formData.get('last_name')!.toString();

    let multiplier = 0;

    if (timeLeft <= 5) {
      multiplier = 0;
    } else if (timeLeft <= 15) {
      multiplier = 0.2;
    } else if (timeLeft <= 25) {
      multiplier = 0.4;
    } else if (timeLeft <= 40) {
      multiplier = 0.6;
    } else if (timeLeft <= 60) {
      multiplier = 0.8;
    }

    const score = correctCount + correctCount * multiplier;

    const newEntry = await createEntry(
      first_name,
      last_name,
      correctCount + ' / ' + questions.length,
      TIME_ALLOWED - timeLeft,
      score
    );

    let message = '';
    let messageElement = document.createElement('p');

    const spinner = document.getElementById('spinner');
    spinner!.style.display = 'none';

    if (!newEntry) {
      message = 'Entry creation has failed. Try again later.';
      result.classList.add('failure');
    } else {
      message = 'Entry was successful!';
      result.classList.add('success');
    }

    messageElement.innerText = message;
    result.appendChild(messageElement);
  }

  return (
    <main>
      <Link
        className='button reveal_button lightcoral'
        id='view_link'
        href='/view'
      >
        <div className='icon_wrapper'>
          <Eye />
        </div>

        <div className='text_wrapper'>
          <span className='link_text'>View Entries</span>
        </div>
      </Link>

      <form
        id='quiz_form'
        action=''
        method='POST'
        onSubmit={(e) => onFormSubmit(e)}
        ref={formRef}
      >
        <div className='form_card'>
          <div className='form_card_content'>
            <div className='title'>
              <h1>Demo Form</h1>
              <p>
                This is a form demo. Complete the quiz (it's biology) within 1
                minute and get a score.
              </p>
            </div>

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
              className='button regular_button lightcoral'
              onClick={(e) => onClickNext(e)}
            >
              Next
            </button>
          </div>
        </div>

        <div className='form_card'>
          <div className='form_card_content'>
            <div className='timer_wrapper'>
              <span>Time left: </span>
              <span id='time_left' ref={timerRef}>
                {timeLeft}
              </span>
              <span> seconds</span>
            </div>

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
                          onChange={(e) => handleChange(e)}
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

            <button
              type='submit'
              form='quiz_form'
              className='button regular_button blue'
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      <section className='full_width full_height' id='result'>
        <div id='spinner'>
          <Spinner />
        </div>
      </section>
    </main>
  );
}

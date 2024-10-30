import { fetchEntries } from '@/lib/actions';
import { ArrowLeftFromLine } from 'lucide-react';
import Link from 'next/link';

export default async function View() {
  const entries = await fetchEntries();

  return (
    <main id='entries'>
      <Link className='button reveal_button violet' id='back_link' href='/'>
        <div className='icon_wrapper'>
          <ArrowLeftFromLine />
        </div>

        <div className='text_wrapper'>
          <span className='link_text'>Back to Form</span>
        </div>
      </Link>

      <table id='entries_table'>
        <thead>
          <tr>
            <th className='name'>First Name</th>
            <th className='name'>Last Name</th>
            <th className=''>Correct Answers</th>
            <th className='number'>Time Taken</th>
            <th className='number'>Score</th>
          </tr>
        </thead>

        <tbody>
          {entries &&
            entries.map((entry, index) => (
              <tr key={'entry_' + index}>
                <td className='name'>{entry.first_name}</td>
                <td className='name'>{entry.last_name}</td>
                <td className=''>{entry.correct_answers}</td>
                <td className='number'>{entry.time} seconds</td>
                <td className='number'>{entry.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}

<script>
    import Line from 'components/Line';
</script>

<div>
    <h3>About Our Research</h3>
    <p>Tryal.AI is working on technology to automatically mark and return grades for maths students practicing for exams</p>
    <p>To help with this research, we need to understand how students interact with different ways to write their answers</p>
    <p>This site does not collect any personally identifiable information, we're only interested in how you answer our questions</p>
    <p>In return you'll get a chance to try our prototype system and see if it helps with your studies</p>
    <p>Before we begin, we would like to get a bit of information about you</p>

    <p>Your Target Grade:</p>
    <Line types={['text']} />
    <p>Last Mock Grade (if you don't have one, enter 0):</p>
    <Line types={['text']} />
    <p>Your Exam Board (if known):</p>
    <Line types={['text']} />
</div>
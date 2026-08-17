<script>
function renderWeek8() {
  return chead('week-8') + `<article>

<section>
<h2>1. Measuring an Algorithm</h2>
<p>Chapter 1 said the optimizer chooses between plans by <b>cost</b>. This chapter is where cost
stops being a word and becomes a number.</p>
<p>Start with the simplest possible task. You have a list of roll numbers and you want to find number
7. The obvious method is to look at each one in turn.</p>
${teach('Linear search', 'check them all, in order', [
  'Start with the <b>first</b> element, compare it with the key, and return if they match. If not, proceed sequentially through each element until a match is found or the list is exhausted.',
  'Because it is the method that needs no preparation at all: the data can be in any order whatsoever.',
  'Looking for a friend in a queue by walking from the front and checking every face.',
  'A table with no index. The engine reads row 1, row 2, row 3, which is exactly what a <b>full table scan</b> is.',
  'Finding roll number 7 in a list starting at 1 takes 7 comparisons. Finding the last of <i>n</i> items takes <i>n</i>.',
  'Sequential examination of each element until the target is found or the list is exhausted.',
])}
<p>Notice the question we just asked: <b>how many comparisons?</b> Not how many seconds. Seconds
depend on the machine, the language and what else is running; comparisons depend only on the
algorithm. That is why cost is counted in <b>operations</b>.</p>
<p>One number is not enough, though, because the same algorithm can be fast or slow on the same list
depending on what you happen to be looking for.</p>
<dl class="tight">
  <dt>Best case</dt>
  <dd>The luckiest input. For linear search, the target is first: <b>1</b> comparison.</dd>
  <dt>Worst case</dt>
  <dd>The unluckiest. The target is last, or absent entirely: <b>n</b> comparisons.</dd>
  <dt>Average case</dt>
  <dd>What typically happens. Roughly <b>n/2</b> comparisons.</dd>
</dl>
<p>Designers plan around the <b>worst</b> case, because a guarantee that only holds when you are
lucky is not a guarantee.</p>
${teach('Big-O notation', 'written O(n)', [
  'A way of describing how the cost <b>grows</b> as the input gets bigger, ignoring constants and small terms.',
  'Because at large sizes only the growth rate matters. An algorithm twice as fast per step still loses badly to one that grows more slowly.',
  'Saying a journey takes "about an hour per hundred miles". You are describing the <b>rate</b>, not promising a stopwatch reading.',
  'Linear search is <b>O(n)</b>: double the rows and you double the work. Binary search is <b>O(log n)</b>: double the rows and you add <b>one</b> step.',
  'Constants are dropped, since 2n and 100n both grow linearly. Only the fastest-growing term survives.',
  'f(n) is O(g(n)) if there are constants c and n&#8320; with f(n) &le; c&middot;g(n) for all n &ge; n&#8320;.',
])}
${fig('f-cost',
`<div class="panel">
  <div class="phead"><span class="m" id="co-hd"></span><span class="m" id="co-cnt"></span></div>
  <svg class="d" viewBox="0 0 520 150" id="co-svg"></svg>
  <table class="dt" id="co-tbl" style="margin-top:10px"></table>
  <div class="msg" id="co-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 8.1, Four growth rates on the same axes. Drag the size and watch the gap open.',
`${slider('co-n', 1, 64, 1, 16, 'number of rows n')}`,
'the gap between growth rates is what matters, not the speed of a single step')}
</section>

<section>
<h2>2. Analysing a Loop</h2>
<p>Complexity questions usually arrive as code rather than as prose, so here is the method. <b>Count
how many times each loop runs, then multiply.</b></p>
<pre><code><span class="kw">int</span> sum = 0;
<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; i++) {          <span class="cm">// outer</span>
    <span class="kw">for</span> (<span class="kw">int</span> j = 1; j &lt;= n; j = j * 3) {  <span class="cm">// inner</span>
        sum = sum + i + j;
    }
}</code></pre>
<p>Take the loops one at a time.</p>
<dl class="tight">
  <dt>The outer loop</dt>
  <dd><code>i</code> goes up by <b>1</b> each time, from 1 to n. That is <b>n</b> iterations.</dd>
  <dt>The inner loop</dt>
  <dd><code>j</code> is <b>multiplied by 3</b> each time: 1, 3, 9, 27, and so on until it passes n.
  The question is how many times you can multiply by 3 before exceeding n, and the answer is
  <b>log<sub>3</sub> n</b>.</dd>
  <dt>Together</dt>
  <dd>The inner loop runs in full for <i>every</i> iteration of the outer, so multiply:
  <b>n &times; log<sub>3</sub> n</b>.</dd>
</dl>
<div class="eq">worst case = <span class="v">O(n log<sub>3</sub> n)</span></div>
<p>The rule to carry away: <b>a counter that is added to gives a linear count; a counter that is
multiplied gives a logarithmic count</b>, and the base of the logarithm is whatever it is multiplied
by. Multiplying by 2 gives log<sub>2</sub> n; by 3, log<sub>3</sub> n.</p>
<p>And nested loops <b>multiply</b>, they do not add. Two sequential loops, one after the other,
would give O(n) + O(log n) = O(n), since only the fastest-growing term survives.</p>
</section>

<section>
<h2>3. Sorting Buys You Binary Search</h2>
<p>Linear search makes no assumption about order, and that is exactly what makes it slow. If the list
is <b>sorted</b>, a far better method opens up.</p>
${teach('Binary search', 'halve the problem each time', [
  'Compare the key with the <b>middle</b> element. If they match, return the index. If the key is <b>greater</b>, the new list is everything to the <b>right</b> of the middle. If <b>smaller</b>, everything to the <b>left</b>.',
  'Because throwing away half the possibilities per step reaches an answer astonishingly fast: 1,000,000 items in about 20 steps.',
  'Finding a word in a dictionary. You open the middle, see you have gone too far, and never look at the second half again.',
  'This is why an index makes a lookup fast: it keeps the keys in order so the engine can halve rather than scan.',
  '<b>The input must be a sorted list.</b> That is not an optimisation, it is a requirement: on unsorted data the method is simply wrong.',
  'O(log n) worst case, on a sorted array with random access.',
])}
<p>Those two definitions are asked as statements to be checked, and the errors offered are always the
same swap: attributing the <b>middle element</b> to linear search, or the <b>first element</b> to
binary search, or claiming linear search needs sorted input. It does not; binary search does.</p>
${fig('f-search',
`<div class="panel">
  <div class="phead"><span class="m" id="se-hd"></span><span class="m" id="se-cnt"></span></div>
  <table class="dt" id="se-tbl"></table>
  <div class="msg" id="se-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 8.2, The same search by both methods. Step through and count the comparisons each one needs.',
`<span class="lab">method:</span>${pills('se', [['lin', 'linear'], ['bin', 'binary']], 1)}
 <span class="lab">looking for:</span>${pills('sv', [['7', '7'], ['23', '23'], ['31', '31'], ['12', '12 (absent)']], 2)}
 <button class="btn" id="se-step">Step</button><button class="btn" id="se-reset">Reset</button>`,
'binary search only works because the list is sorted')}
<p>Nothing is free. Binary search needs the data <b>kept</b> in sorted order, and inserting into a
sorted array means shifting everything after the insertion point. Which is exactly the problem the
next structure solves.</p>
</section>

<section>
<h2>4. Trees</h2>
<p>Some vocabulary first, because every term after this uses it. A tree is drawn upside down, with
the root at the top.</p>
${teach('Tree', 'a branching structure with no loops', [
  'A set of <b>nodes</b> connected by <b>edges</b>, where every node has exactly one parent except the topmost one, and there are no cycles.',
  'Because it lets you organise data so that following a path from the top narrows the search dramatically at every step.',
  'A family tree, or the folder structure on your computer: one top folder, folders inside it, files inside those.',
  'Database indexes are trees. Following a few edges from the root reaches the right block out of millions.',
  'Exactly <b>one path</b> exists between any two nodes. That is what "no cycles" buys you, and it is why you can never get lost.',
  'A connected acyclic graph with a distinguished root.',
])}
<dl class="tight">
  <dt>Node and edge</dt>
  <dd>A node holds a value; an edge connects a node to another below it.</dd>
  <dt>Root</dt>
  <dd>The single node with <b>no parent</b>. Every search starts here.</dd>
  <dt>Leaf</dt>
  <dd>A node with <b>no children</b>. In a database index, leaves are where the pointers to actual
  rows live.</dd>
  <dt>Internal node</dt>
  <dd>Any node that is neither the root nor a leaf: it has both a parent and at least one child.</dd>
  <dt>Parent and child</dt>
  <dd>Directly above and directly below. Nodes sharing a parent are <b>siblings</b>.</dd>
  <dt>Degree</dt>
  <dd>How many children a node has. The degree of the <b>tree</b> is the largest of these.</dd>
  <dt>Depth of a node</dt>
  <dd>How many edges lie between it and the root. The root has depth 0.</dd>
  <dt>Height of the tree</dt>
  <dd>The depth of the deepest leaf: the length of the longest path down. <b>Height is what a search
  costs</b>, since a search follows one path from root to leaf.</dd>
</dl>
${fig('f-tree',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 166" id="tv-svg"></svg>
  <div class="msg" id="tv-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 8.3, The vocabulary of a tree, on one small example.',
`<span class="lab">term:</span>${pills('tv', [['root', 'root'], ['leaf', 'leaves'], ['int', 'internal'], ['par', 'parent &amp; children'], ['h', 'height'], ['d', 'depth'], ['deg', 'degree']], -1)}`,
'every node has one parent except the root, and there are no cycles')}
</section>

<section>
<h2>5. Binary Search Trees</h2>
${teach('Binary search tree', 'BST', [
  'A tree where every node has at most two children, and everything in the <b>left</b> subtree is smaller than the node while everything in the <b>right</b> is larger.',
  'Because it gives you binary search&rsquo;s halving <b>and</b> cheap insertion, with no shifting of a whole array.',
  'A sorted filing system where each drawer says "smaller things that way, bigger things this way".',
  'Searching means comparing at each node and going left or right. Each comparison discards a whole subtree.',
  'Insert by searching for where the value <i>would</i> be and putting it there. Nothing else moves.',
  'A binary tree satisfying the ordering invariant left &lt; node &lt; right at every node.',
])}
${fig('f-bst',
`<div class="panel">
  <div class="phead"><span class="m" id="bs-hd"></span><span class="m" id="bs-cnt"></span></div>
  <svg class="d" viewBox="0 0 520 168" id="bs-svg"></svg>
  <div class="msg" id="bs-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 8.4, A search descending a tree. Every comparison throws away an entire subtree.',
`<span class="lab">find:</span>${pills('bs', [['23', '23'], ['4', '4'], ['31', '31'], ['15', '15 (absent)']], 0)}
 <button class="btn" id="bs-step">Step</button><button class="btn" id="bs-reset">Reset</button>`,
'each comparison discards a whole subtree, which is why the cost is the height')}
<p>The cost of a search is the <b>height</b>, not the number of nodes. A balanced tree of <i>n</i>
nodes has height about log<sub>2</sub> <i>n</i>, so a million rows sit about 20 steps from the
root.</p>

<h3>Which insertion order produced this tree?</h3>
<p>A common question shows a finished tree and several insertion sequences, and asks which ones
produce it. The method is simple and worth practising.</p>
<div class="eq"><span class="v">insert each value by searching for where it belongs</span>
<span class="eqn">every value lands as a leaf, and nothing already placed ever moves</span></div>
<p>Two consequences make the checking fast:</p>
<ul>
  <li><b>The first value inserted is always the root.</b> So any sequence whose first element is not
  the root value can be discarded immediately.</li>
  <li><b>A parent must be inserted before its child.</b> If the tree shows 65 as a child of 75, then
  75 must appear earlier in the sequence than 65. Scan for one violation and you can reject a
  sequence without building anything.</li>
</ul>
<p>Beyond that, <b>siblings can be inserted in either order</b>, which is why <i>several</i>
different sequences often produce the same tree. That is exactly why these questions usually have
more than one correct answer.</p>

<h3>Shape depends on insertion order</h3>
${fig('f-shape',
`<div class="panel">
  <div class="phead"><span class="m" id="sh-hd"></span><span class="m" id="sh-h"></span></div>
  <svg class="d" viewBox="0 0 520 176" id="sh-svg"></svg>
  <div class="msg" id="sh-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 8.5, The same seven values inserted in two different orders. Same values, same rules, wildly different cost.',
`<span class="lab">inserted in this order:</span>${pills('sh', [['bal', '23, 12, 31, 4, 18, 27, 40'], ['deg', '4, 12, 18, 23, 27, 31, 40']], 0)}`,
'a BST built from already-sorted data degenerates into a list')}
<p>Insert values in <b>sorted</b> order and every new value goes to the right of the last one. The
tree becomes a straight line, its height becomes <i>n</i> &minus; 1, and searching it costs exactly
as much as linear search. All the advantage is gone.</p>
<p>This is why real database indexes are <b>self-balancing</b> trees, which reshape themselves on
insertion to keep the height near log <i>n</i> whatever order the data arrives in. Week 9 builds
them.</p>
</section>

<section>
<h2>6. Why the Disk Changes Everything</h2>
<p>Everything so far counted comparisons and treated them as equal. For a database that is
<b>wrong</b>, because the data does not fit in memory and the two places it can live differ by a
factor of about a hundred thousand.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Storage</th><th>Typical access time</th><th>Survives a power cut?</th><th>Cost per GB</th></tr></thead>
<tbody>
<tr><td><b>Registers and cache</b></td><td>about a nanosecond</td><td>no</td><td>enormous</td></tr>
<tr><td><b>Main memory (RAM)</b></td><td>tens of nanoseconds</td><td><b>no</b></td><td>high</td></tr>
<tr><td><b>Magnetic disk</b></td><td>about 10 milliseconds</td><td>yes</td><td>low</td></tr>
<tr><td><b>Tape</b></td><td>seconds</td><td>yes</td><td>lowest</td></tr>
</tbody></table></div>
<p>Sit with the middle two rows. A memory access takes tens of nanoseconds; a disk access takes about
ten milliseconds. <b>The disk is roughly 100,000 times slower.</b> Scaled to human time, if reading
from memory took one second, reading from disk would take over a day.</p>
<p>Two consequences shape the rest of this chapter:</p>
<ul>
  <li><b>Counting comparisons is the wrong measure.</b> The number that matters is <b>how many times
  you touch the disk</b>. An algorithm doing twice the arithmetic but one fewer disk read wins
  easily.</li>
  <li><b>Memory is volatile.</b> It empties on power loss, which is why durability from Chapter 1
  means <i>written to disk</i>, and why a transaction cannot commit until that write has
  happened.</li>
</ul>
</section>

<section>
<h2>7. How a Magnetic Disk Is Built</h2>
<p>The 10 milliseconds is not a manufacturing shortcoming. It is <b>mechanical</b> (things physically
move), so the structure is worth knowing.</p>
<dl class="tight">
  <dt>Platter</dt>
  <dd>A rigid magnetic disc. A drive stacks several, and <b>both surfaces</b> of each are used, so
  8 platters give <b>16 surfaces</b>. A "double-sided platter" is just making that explicit.</dd>
  <dt>Spindle</dt>
  <dd>The shaft holding all the platters, spinning them together at a constant speed, often 7200
  revolutions per minute.</dd>
  <dt>Track</dt>
  <dd>One concentric ring on one surface. A surface holds thousands of them.</dd>
  <dt>Sector</dt>
  <dd>A track divided into arcs. <b>The sector is the smallest unit that can be read or written</b>,
  typically 512 bytes. Wanting one byte still costs a whole sector.</dd>
  <dt>Cylinder</dt>
  <dd>The same-numbered track on <b>every</b> surface, stacked vertically. All the heads move
  together, so a whole cylinder is reachable <b>without moving the arm at all</b>.</dd>
  <dt>Read-write head and arm</dt>
  <dd>One head per surface, all mounted on one arm that swings in and out. Moving it is the expensive
  operation.</dd>
</dl>
${fig('f-disk',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 200" id="dk-svg"></svg>
  <div class="msg" id="dk-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 8.6, The parts of a magnetic disk. Pick one to see what it is and what it costs you.',
`<span class="lab">part:</span>${pills('dk', [['pl', 'platter'], ['tr', 'track'], ['se', 'sector'], ['cy', 'cylinder'], ['hd', 'head &amp; arm'], ['sp', 'spindle']], -1)}`,
'the disk is slow because parts of it physically move')}

<h3>Two facts that come straight out of the geometry</h3>
<p>Both are asked as short questions and both follow from the definitions above.</p>
<div class="eq">number of <span class="v">cylinders</span> = number of <span class="v">tracks per surface</span>
<span class="eqn">because a cylinder is one track position taken across all surfaces at once</span></div>
<p>So a disk with 3000 tracks per surface has <b>3000 cylinders</b>, however many platters it has.
Multiplying by the number of surfaces is the standard wrong answer.</p>
<div class="eq">a <span class="v">block size</span> must be a whole-number <span class="v">multiple of the sector size</span>
<span class="eqn">because the sector is the smallest unit the hardware can read</span></div>
<p>With 512-byte sectors, 1536 is a legal block size, because 1536 = 512 &times; 3. 256 is not,
because you cannot read half a sector, and 786 is not, because it is not a multiple of 512.</p>

<h3>How much the whole thing holds</h3>
<div class="eq">capacity = <span class="v">surfaces</span> &times; <span class="v">tracks per surface</span> &times; <span class="v">sectors per track</span> &times; <span class="v">bytes per sector</span>
<span class="eqn">and surfaces = platters &times; 2</span></div>
${fig('f-cap',
`<div class="panel">
  <div class="phead"><span class="m">disk capacity</span><span class="m" id="cp-tot"></span></div>
  <table class="dt" id="cp-tbl"></table>
  <div class="msg" id="cp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 8.7, The capacity calculation, with every factor adjustable.',
`${slider('cp-pl', 1, 8, 1, 4, 'platters')} ${slider('cp-tr', 1000, 20000, 500, 10000, 'tracks per surface')}
 ${slider('cp-se', 50, 1024, 1, 500, 'sectors per track')} ${slider('cp-by', 512, 4096, 512, 512, 'bytes per sector')}`,
'the number of surfaces is twice the number of platters')}
</section>

<section>
<h2>8. What a Read Costs</h2>
<p>Reading takes three separate things to happen, and only the last involves any data moving.</p>
${teach('Seek time', 'moving the arm', [
  'The time for the read-write arm to swing to the right track.',
  'Because the arm is a physical object with mass. It has to accelerate, travel and stop.',
  'Walking to the right shelf in a library. Nothing is being read yet; you are only getting there.',
  'Typically <b>4 to 12 milliseconds</b> on average. This is usually the largest of the three.',
  'It depends on <b>distance</b>: an adjacent track is nearly free, the far side of the disk is not. Hence average seek time.',
  'The time to reposition the arm over the correct track.',
])}
${teach('Rotational latency', 'waiting for the platter to come round', [
  'Once the arm is on the right track, the time until the wanted sector spins under the head.',
  'Because the platter is turning and the sector might have just passed. You cannot go backwards; you wait for the next revolution.',
  'Standing at a luggage carousel waiting for your bag to come round again.',
  'On average <b>half a revolution</b>. At 7200 rpm one turn takes 8.33 ms, so the average latency is about <b>4.17 ms</b>.',
  'It is the time for the sector to appear under the head, <b>not</b> the time to reposition the arm. Swapping those two definitions is the standard wrong answer.',
  '(60000 / rpm) / 2 milliseconds, on average.',
])}
${teach('Transfer time', 'actually reading the bytes', [
  'The time to read the data once the head is finally over it.',
  'Because bytes stream off the surface at a finite rate as it spins past.',
  'Reading the page once you have found it.',
  'For a single 512-byte sector this is a fraction of a millisecond, far smaller than the other two.',
  'Compute it as <b>data size divided by data transfer rate</b>.',
  'data size / transfer rate.',
])}
<p>Now the two definitions that get confused, and the distinction is exact.</p>
<div class="eq"><span class="v">access time</span> = seek time + rotational latency
<span class="eqn">the time from the request being issued to the moment the data transfer BEGINS</span></div>
<p>Access time deliberately <b>excludes</b> the transfer, because it measures getting there, not
reading. To get the total cost of actually reading a block, add the transfer on top:</p>
<div class="eq"><span class="v">total disk access time</span> = seek + rotational latency + transfer</div>
${wex('Worked: total disk access time for one block',
mini(['given', 'value'],
  [['average seek time', '12 ms'], ['average rotational delay', '3.5 ms'],
   ['disk block size', '4 KB'], ['data rate', '256 KB/sec']]) +
'<p style="margin:8px 0 0"><b>Transfer time</b> = block size / data rate = 4 / 256 sec ' +
'= 0.015625 sec = <b>15.625 ms</b>. Converting to milliseconds is where this goes wrong most ' +
'often.</p>' +
'<div class="eq" style="margin:8px 0 0">12 + 3.5 + 15.625 = <b>31.125 ms</b></div>')}

<h3>What the transfer rate depends on</h3>
<p>A separate question, and the answer is not what most people guess.</p>
<div class="eq">data transfer rate = <span class="v">amount of data on one track</span> / <span class="v">time for one rotation</span></div>
<p>Read the formula and the answer falls out. The rate depends on:</p>
<dl class="tight">
  <dt><b>Rotational speed of the disk</b>, yes</dt>
  <dd>It sets the denominator: faster rotation means less time per revolution, so a higher rate.</dd>
  <dt><b>Track density</b>, yes</dt>
  <dd>It sets the numerator: more data packed on a track means more bytes stream past per
  revolution.</dd>
  <dt><b>Number of bytes to be transferred</b>, no</dt>
  <dd>File size determines transfer <b>time</b>, not transfer <b>rate</b>. The rate is a property of
  the drive.</dd>
  <dt><b>Seek speed</b>, no</dt>
  <dd>Seeking happens before any transfer begins and has nothing to do with how fast bytes then
  stream.</dd>
</dl>
${fig('f-time',
`<div class="panel">
  <div class="phead"><span class="m" id="tm-hd"></span><span class="m" id="tm-tot"></span></div>
  <svg class="d" viewBox="0 0 520 96" id="tm-svg"></svg>
  <table class="dt" id="tm-tbl" style="margin-top:6px"></table>
  <div class="msg" id="tm-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 8.8, The three components to scale. The bar shows where the time actually goes.',
`${slider('tm-sk', 0, 14, 0.5, 12, 'average seek time (ms)')} ${slider('tm-rp', 5400, 15000, 600, 7200, 'rotation (rpm)')}
 ${slider('tm-kb', 4, 512, 4, 4, 'data to read (KB)')} ${slider('tm-dr', 64, 1024, 64, 256, 'data rate (KB/s)')}`,
'the two waiting times dominate, and only one read pays them')}
<p>Now the practical lesson, and it justifies almost everything a storage engine does. Since seek and
latency are paid <b>once per read</b> regardless of size, reading one large block is dramatically
cheaper than reading many small ones. So databases read and write in <b>blocks</b> of several
kilobytes rather than single sectors, and try hard to store related data next to each other, ideally
within one cylinder, where no seek is needed at all.</p>
</section>

<section>
<h2>9. Reliability: MTBF and Disk Arrays</h2>
<p>Disks fail. Large systems use many of them, and using many changes the arithmetic in a direction
that surprises people.</p>
${teach('MTBF', 'mean time between failures', [
  'The average time a device runs before it fails.',
  'Because planning maintenance, backups and redundancy all need a number for how often things break.',
  'A light bulb rated for 10,000 hours. Any one bulb might go sooner or later, but that is the average.',
  'A single disk might have an MTBF of 600,000 hours, which is roughly 68 years.',
  'It describes <b>one</b> device. Put many devices together and failures arrive far more often, because <b>any one of them</b> failing counts.',
  'The expected time between successive failures of a repairable system.',
])}
<div class="eq">MTBF(array) = <span class="v">MTBF(one disk)</span> / <span class="v">number of disks</span></div>
<p>The reasoning is the useful part. One disk lasting 600,000 hours means a failure roughly once
every 600,000 hours. Put <i>n</i> of them side by side and you now have <i>n</i> chances of a failure
in the same period, so failures arrive <i>n</i> times more often and the average gap shrinks by a
factor of <i>n</i>.</p>
${wex('Worked: how many disks are in the array?',
'<p style="margin:0 0 8px">A single disk has MTBF 600,000 hours. The disk <b>system</b> fails on ' +
'average every 800 hours. How many disks?</p>' +
'<div class="eq" style="margin:0 0 8px">n = MTBF(one disk) / MTBF(array) = 600000 / 800 = <b>750</b></div>' +
'<p style="margin:0">750 disks. Sanity-check the direction: more disks must mean <b>more frequent</b> ' +
'failures, so the array MTBF must be <b>smaller</b> than a single disk&rsquo;s, and it is: 800 hours ' +
'against 600,000. If your answer makes the array more reliable than one disk, you have divided the ' +
'wrong way round.</p>')}
<p>This is precisely why large installations use redundancy: not because individual disks are bad,
but because putting hundreds together makes failure a routine event rather than a rare one.</p>
</section>

<section>
<h2>10. Disk Arm Scheduling</h2>
<p>Many requests arrive at once, for tracks scattered across the disk. Since moving the arm is the
expensive part, the <b>order</b> in which they are served matters a great deal.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Algorithm</th><th>How it chooses the next request</th><th>Character</th></tr></thead>
<tbody>
<tr><td><b>FCFS</b><br>first come, first served</td><td>Whatever arrived first</td><td>Fair, and can send the arm flying back and forth across the disk</td></tr>
<tr><td><b>SSTF</b><br>shortest seek time first</td><td>Whichever track is <b>nearest</b> to where the head is now</td><td>Efficient on average, and can <b>starve</b> far-away requests indefinitely</td></tr>
<tr><td><b>SCAN</b><br>the elevator algorithm</td><td>Continue in the <b>current direction</b>, serving everything on the way, then reverse at the end</td><td><b>Minimum possible change in head direction.</b> No starvation</td></tr>
<tr><td><b>LOOK</b></td><td>Like SCAN, but reverses at the <b>last request</b> instead of the physical end</td><td>Slightly less travel than SCAN</td></tr>
</tbody></table></div>
<p>The property that gets asked is direction changes, and the reasoning is worth following.</p>
<p><b>SCAN ensures the minimum possible change in head direction.</b> It is called the elevator
algorithm because a lift behaves the same way: it goes all the way up serving every floor requested,
then all the way down. Whatever the request sequence, the arm reverses <b>only at the ends</b>.</p>
<p>The other three choose the next request by some criterion about that request, so the head can be
sent one way and then immediately back. FCFS follows arrival order, which is arbitrary, and SSTF
follows nearness, which can jump either side. Both can reverse many times on the same sequence that
SCAN handles with one reversal.</p>
</section>

<section>
<h2>11. File Organization</h2>
<p>A table has to be laid out in a file somehow, and the choice of layout is called the file
organization.</p>
<p>The <b>objectives</b> of file organization are worth listing, because a question asks which one is
<i>not</i> among them:</p>
<ul>
  <li>Efficient <b>storage</b> of records.</li>
  <li>Efficient <b>selection</b>: finding the records you want.</li>
  <li>Efficient <b>update</b>: inserting, changing and deleting.</li>
</ul>
<p>And the one that is <b>not</b> an objective: <b>keeping the relations in normalized form.</b>
Normalization is a <i>logical</i>-level concern from Chapter 6, decided before storage is considered
at all. File organization is a <i>physical</i>-level concern. Mixing the two levels is exactly the
confusion Chapter 1&rsquo;s three-level architecture exists to prevent.</p>
${teach('Heap file organization', 'put it wherever there is room', [
  'Records are placed anywhere in the file where there is free space, in no particular order.',
  'Because insertion then costs almost nothing: find any free spot and write.',
  'Throwing receipts into a shoebox. Filing is instant; finding one later is not.',
  'A table with no clustering and no order requirement.',
  'Insertion is fast, and searching means scanning. <b>No manual reorganisation is needed</b>, because there was no order to maintain in the first place.',
  'Unordered placement of records in the file.',
])}
${teach('Sequential file organization', 'keep them in order by a key', [
  'Records are stored sorted by a chosen <b>search key</b>.',
  'Because reading them in key order then costs nothing, and searching can use the ordering.',
  'A filing cabinet in alphabetical order. Finding is easy; inserting in the middle means shuffling everything along.',
  'A table clustered on its primary key.',
  'On insert, if there is <b>no free space</b> at the right position, the new record goes into an <b>overflow block</b> instead, linked from the proper place.',
  'Records ordered by a search key, with an overflow area for insertions.',
])}
<p>Those overflow blocks are the cost of keeping order, and they accumulate. Over time the file is
increasingly scattered between its main area and its overflow blocks, so <b>a sequential file must be
reorganised from time to time</b> to restore the physical ordering.</p>
<p>The contrast is the point, and the two statements are often offered swapped:</p>
<div class="eq"><span class="v">heap</span>: no order, so <b>no</b> reorganisation needed <span class="op">&middot;</span> <span class="v">sequential</span>: ordered, so overflow blocks and periodic reorganisation
<span class="eqn">saying a heap file needs reorganising "to restore the sequential order" is wrong: it never had one</span></div>
</section>

<section>
<h2>12. The Buffer and Replacement Policies</h2>
<p>Given that disk is 100,000 times slower, the obvious move is to avoid going there. That is what
the <b>buffer</b> is for: the component Chapter 1 listed inside the storage manager.</p>
${teach('Buffer', 'a small piece of memory holding disk blocks', [
  'An area of main memory where recently used disk blocks are kept, so they can be reused without another disk read.',
  'Because the same blocks are read over and over, and every avoided read saves about 10 milliseconds.',
  'Keeping the books you are working from open on the desk rather than walking back to the shelf for each one.',
  'The <b>buffer manager</b> of Chapter 1 decides what stays in memory and what is evicted.',
  'A <b>hit</b> means the block was already there. A <b>miss</b> means a disk read was needed.',
  'A memory region caching disk-resident pages, managed by a replacement policy.',
])}
<p>The buffer is small and the disk is large, so it fills up. When a new block is needed and there is
no free frame, something must be thrown out, and <b>which</b> one is the whole question.</p>
<div class="eq">hit ratio = <span class="v">hits</span> / <span class="v">total requests</span>
<span class="eqn">the single number by which a replacement policy is judged</span></div>
<dl class="tight">
  <dt>LRU, least recently used</dt>
  <dd>Evict the block untouched for the longest time. The bet: what you have not used lately, you
  probably will not use soon. This is the standard choice and it is right most of the time.</dd>
  <dt>MRU, most recently used</dt>
  <dd>Evict the block used <b>most</b> recently. Counter-intuitive, and right in one specific
  situation: when you have just finished with a block and know you will not want it again, as when
  scanning a large table straight through.</dd>
</dl>
${fig('f-buf',
`<div class="panel">
  <div class="phead"><span class="m" id="bf-pol"></span><span class="m" id="bf-stat"></span></div>
  <table class="dt" id="bf-tbl"></table>
  <div class="msg" id="bf-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 8.9, The same request sequence through both policies. The grid shows the buffer after every request.',
`<span class="lab">policy:</span>${pills('bf', [['lru', 'LRU'], ['mru', 'MRU']], 0)}
 ${slider('bf-f', 2, 5, 1, 3, 'buffer frames')}
 <button class="btn" id="bf-step">Step</button><button class="btn" id="bf-all">Run all</button>
 <button class="btn" id="bf-reset">Reset</button>`,
'a hit costs nothing; a miss costs a disk read')}
<p>Two things are worth noticing while stepping through it.</p>
<p><b>Neither policy always wins.</b> On some request sequences MRU beats LRU and on others it loses.
The only way to tell is to work out the hit ratio for the sequence in question, which is exactly what
these calculations are for.</p>
<p><b>A hit changes the ordering.</b> This is where MRU questions go wrong most often. If a block is
already in the buffer, that request is a hit <i>and</i> it becomes the most recently used, so it
becomes the next candidate for eviction under MRU. MRU is therefore <b>not</b> the same as "last in,
first out": last-in tracks when a block <i>arrived</i>, while MRU tracks when it was last
<i>touched</i>, and a hit changes the second without changing the first.</p>
</section>

</article>` + cfoot('week-8');
}

function initWeek8() {
  /* ---- Fig 8.1 growth rates ---- */
  (function () {
    const F = [['O(1)', n => 1, 'var(--green)'], ['O(log n)', n => Math.log2(n) + 1, 'var(--indigo)'],
      ['O(n)', n => n, 'var(--terra)'], ['O(n log n)', n => n * (Math.log2(n) + 1), 'var(--purple)']];
    function draw() {
      const n = +$('#co-n').value;
      $('#co-n-v').textContent = n;
      const maxY = Math.max(8, F[3][1](n));
      const x = i => 40 + (i / 64) * (DG.W - 66);
      const y = v => 130 - (Math.min(v, maxY) / maxY) * 106;
      let s = DG.line(40, 130, DG.W - 22, 130, { stroke: '#e5e5e3' }) +
        DG.line(40, 20, 40, 130, { stroke: '#e5e5e3' });
      F.forEach(f => {
        let d = '';
        for (let i = 1; i <= 64; i++) d += (i === 1 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(f[1](i)).toFixed(1) + ' ';
        s += `<path d="${d}" fill="none" stroke="${f[2]}" stroke-width="1.4" opacity="0.85"/>`;
      });
      s += DG.line(x(n), 20, x(n), 130, { stroke: 'var(--muted)', sw: 0.8 });
      F.forEach((f, i) => {
        s += `<rect x="${52 + i * 118}" y="140" width="9" height="3" fill="${f[2]}"/>`;
        s += DG.txt(66 + i * 118, 145, f[0], { cls: 'm mu' });
      });
      s += DG.txt(36, 26, 'ops', { anchor: 'end', cls: 'm mu' });
      s += DG.txt(36, 133, '0', { anchor: 'end', cls: 'm mu' });
      s += DG.txt(DG.W - 22, 14, 'n = ' + n, { anchor: 'end', cls: 'm mu' });
      $('#co-svg').innerHTML = s;
      $('#co-tbl').innerHTML = '<thead><tr><th>growth</th><th>operations at n = ' + n +
        '</th><th>meaning</th></tr></thead><tbody>' +
        [['O(1)', 1, 'constant: size makes no difference at all'],
          ['O(log n)', Math.ceil(Math.log2(n) + 1), 'double n, add <b>one</b> step'],
          ['O(n)', n, 'double n, double the work'],
          ['O(n log n)', Math.ceil(n * (Math.log2(n) + 1)), 'double n, slightly more than double']]
          .map((r, i) => `<tr class="${i === 1 ? 'hi' : ''}"><td>${r[0]}</td><td>${r[1]}</td>` +
            `<td>${r[2]}</td></tr>`).join('') + '</tbody>';
      $('#co-hd').textContent = 'operations needed as n grows';
      const lin = n, log = Math.ceil(Math.log2(n) + 1);
      $('#co-cnt').textContent = 'n = ' + n;
      $('#co-note').innerHTML = 'At n = <b>' + n + '</b>, linear search needs <b>' + lin +
        '</b> comparisons and binary search needs <b>' + log + '</b>. The ratio is ' +
        (lin / log).toFixed(1) + ' to 1, and it keeps widening, because one grows and the other barely does.';
      $('#f-cost-msg').textContent = n <= 4
        ? 'At tiny sizes the curves are almost on top of each other. Growth rate only matters as n gets large, which for a database it always is.'
        : 'the gap between growth rates is what matters, not the speed of a single step';
    }
    $('#co-n').oninput = draw;
    draw();
  })();

  /* ---- Fig 8.2 linear vs binary ---- */
  (function () {
    const A = [4, 7, 12, 18, 23, 27, 31];
    let method = 'bin', target = 31, k = 0;
    function trace() {
      const steps = [];
      if (method === 'lin') {
        for (let i = 0; i < A.length; i++) {
          steps.push({ look: [i], lo: 0, hi: A.length - 1, hit: A[i] === target });
          if (A[i] === target) break;
        }
      } else {
        let lo = 0, hi = A.length - 1;
        while (lo <= hi) {
          const m = Math.floor((lo + hi) / 2);
          steps.push({ look: [m], lo, hi, hit: A[m] === target });
          if (A[m] === target) break;
          if (A[m] < target) lo = m + 1; else hi = m - 1;
        }
      }
      return steps;
    }
    function draw() {
      const st = trace();
      const cur = st[Math.min(k, st.length - 1)];
      const done = k >= st.length - 1;
      const found = st.length && st[st.length - 1].hit;
      $('#se-tbl').innerHTML = '<thead><tr>' + A.map((_, i) => `<th>${i}</th>`).join('') +
        '</tr></thead><tbody><tr>' + A.map((v, i) => {
        const inRange = i >= cur.lo && i <= cur.hi;
        const cls = cur.look.includes(i) ? 'hl' : '';
        return `<td class="${cls}" style="${inRange ? '' : 'opacity:.3'}">${v}</td>`;
      }).join('') + '</tr></tbody>';
      $('#se-hd').textContent = (method === 'lin' ? 'linear search' : 'binary search') + ' for ' + target;
      $('#se-cnt').textContent = 'comparison ' + (Math.min(k, st.length - 1) + 1) + ' of ' + st.length;
      const i = cur.look[0];
      $('#se-note').innerHTML = method === 'lin'
        ? 'Comparing <b>' + A[i] + '</b> with ' + target + '. ' +
          (cur.hit ? 'Match, done after ' + st.length + ' comparisons.'
            : 'No match, so move to the next position. Nothing is ever ruled out in bulk: linear search learns only about the one item it just looked at.')
        : 'Middle of positions ' + cur.lo + ' to ' + cur.hi + ' is <b>' + A[i] + '</b>. ' +
          (cur.hit ? 'Match, done after ' + st.length + ' comparisons.'
            : A[i] < target
              ? 'Too small, so <b>everything at or below position ' + i + '</b> is discarded at once: ' + (i - cur.lo + 1) + ' values gone in one comparison.'
              : 'Too large, so <b>everything at or above position ' + i + '</b> is discarded at once: ' + (cur.hi - i + 1) + ' values gone in one comparison.');
      const m = $('#f-search-msg');
      m.className = 'msg ' + (done ? (found ? 'good' : 'bad') : '');
      m.textContent = !done ? 'binary search only works because the list is sorted'
        : found ? (method === 'lin' ? 'Linear' : 'Binary') + ' search found it in ' + st.length +
            ' comparisons. Try the other method on the same target and compare.'
          : 'The value is absent. Both methods must rule out every possibility, but binary search rules them out in blocks.';
      $('#se-step').disabled = done;
    }
    setPills($('#f-search'), 'se', v => { method = v; k = 0; draw(); });
    setPills($('#f-search'), 'sv', v => { target = +v; k = 0; draw(); });
    $('#se-step').onclick = () => { k++; draw(); };
    $('#se-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 8.3 tree vocabulary ---- */
  (function () {
    const N = [['A', 260, 26, 0], ['B', 150, 74, 1], ['C', 370, 74, 1], ['D', 96, 122, 2],
      ['E', 204, 122, 2], ['F', 370, 122, 2], ['G', 150, 166, 3]];
    const E = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['E', 'G']];
    const at = n => N.find(x => x[0] === n);
    const SEL = {
      root: ['A'], leaf: ['D', 'F', 'G'], int: ['B', 'C', 'E'], par: ['B', 'D', 'E'],
      h: ['A', 'B', 'E', 'G'], d: ['D', 'E'], deg: ['A', 'B'],
    };
    const T = {
      root: '<b>A</b> is the root: the one node with no parent. Every search starts here.',
      leaf: '<b>D, F and G</b> are leaves: nodes with no children. In a database index, the leaves hold the pointers to actual rows.',
      int: '<b>B, C and E</b> are internal nodes: they have a parent <i>and</i> at least one child. The root is not internal, and neither is a leaf.',
      par: '<b>B</b> is the parent of <b>D</b> and <b>E</b>, which are its children. D and E share a parent, so they are <b>siblings</b>.',
      h: 'The <b>height</b> of the tree is 3: the longest path from root to leaf is A to B to E to G, which is 3 edges. <b>Height is what a search costs</b>, since a search follows exactly one such path.',
      d: '<b>Depth</b> is measured per node: how many edges to the root. D and E are both at depth 2. The root is at depth 0.',
      deg: '<b>Degree</b> is how many children a node has. A has 2 and B has 2, so the degree of this tree is 2, which makes it a <b>binary</b> tree.',
    };
    function draw(k) {
      const sel = SEL[k] || [];
      let s = '';
      E.forEach(([a, b]) => {
        const p = at(a), c = at(b);
        const on = k === 'h' && sel.includes(a) && sel.includes(b);
        s += DG.line(p[1], p[2] + 11, c[1], c[2] - 11,
          { stroke: on ? 'var(--indigo)' : '#c9c9c4', sw: on ? 1.6 : 1 });
      });
      N.forEach(([n, x, y, d]) => {
        const on = sel.includes(n);
        s += `<circle cx="${x}" cy="${y}" r="13" fill="${on ? 'var(--indigo-tint)' : '#fff'}" ` +
          `stroke="${on ? 'var(--indigo)' : '#e5e5e3'}"/>`;
        s += DG.txt(x, y + 4, n, { anchor: 'middle', cls: 'm' });
        if (k === 'd') s += DG.txt(x + 18, y + 4, 'depth ' + d, { cls: 'm mu' });
      });
      s += DG.txt(DG.PAD, 16, 'a tree is drawn with its root at the top', { cls: 'm mu' });
      $('#tv-svg').innerHTML = s;
      $('#tv-note').innerHTML = T[k] || 'Pick a term to see which nodes it picks out.';
    }
    setPills($('#f-tree'), 'tv', draw);
    draw(null);
  })();

  /* ---- Fig 8.4 BST search ---- */
  (function () {
    const N = [[23, 260, 26], [12, 150, 80], [31, 370, 80], [4, 96, 134], [18, 204, 134],
      [27, 314, 134], [40, 426, 134]];
    const KIDS = { 23: [12, 31], 12: [4, 18], 31: [27, 40] };
    const at = v => N.find(x => x[0] === v);
    let target = 23, k = 0;
    function path() {
      const p = []; let cur = 23;
      while (cur !== undefined) {
        p.push(cur);
        if (cur === target) break;
        const kids = KIDS[cur];
        if (!kids) break;
        cur = target < cur ? kids[0] : kids[1];
      }
      return p;
    }
    function sub(root) {
      const out = [root], kids = KIDS[root];
      if (kids) kids.forEach(c => sub(c).forEach(x => out.push(x)));
      return out;
    }
    function draw() {
      const p = path();
      const step = Math.min(k, p.length - 1);
      const visited = p.slice(0, step + 1);
      const cur = p[step];
      const gone = new Set();
      for (let i = 0; i < step; i++) {
        const node = p[i], kids = KIDS[node];
        if (!kids) continue;
        const drop = target < node ? kids[1] : kids[0];
        sub(drop).forEach(x => gone.add(x));
      }
      let s = '';
      Object.keys(KIDS).forEach(pv => KIDS[pv].forEach(cv => {
        const a = at(+pv), b = at(cv);
        const on = visited.includes(+pv) && visited.includes(cv);
        s += DG.line(a[1], a[2] + 12, b[1], b[2] - 12,
          { stroke: on ? 'var(--indigo)' : gone.has(cv) ? '#f0f0ee' : '#c9c9c4', sw: on ? 1.6 : 1 });
      }));
      N.forEach(([v, x, y]) => {
        const isCur = v === cur, seen = visited.includes(v), dead = gone.has(v);
        s += `<circle cx="${x}" cy="${y}" r="14" fill="${isCur ? 'var(--indigo-tint)' : '#fff'}" ` +
          `stroke="${isCur ? 'var(--indigo)' : seen ? 'var(--indigo)' : dead ? '#f0f0ee' : '#e5e5e3'}" ` +
          `${dead ? 'opacity="0.35"' : ''}/>`;
        s += DG.txt(x, y + 4, String(v), { anchor: 'middle', cls: 'm', fill: dead ? '#c9c9c4' : '#111' });
      });
      const done = k >= p.length - 1;
      const found = p[p.length - 1] === target;
      s += DG.txt(DG.PAD, 162, gone.size
        ? gone.size + ' of 7 nodes ruled out without ever being looked at' : 'nothing ruled out yet',
        { cls: 'm mu' });
      $('#bs-svg').innerHTML = s;
      $('#bs-hd').textContent = 'searching for ' + target;
      $('#bs-cnt').textContent = 'comparison ' + (step + 1) + ' of ' + p.length;
      $('#bs-note').innerHTML = cur === target
        ? 'Found <b>' + target + '</b> after ' + p.length + ' comparisons. The tree has 7 nodes, and ' +
          gone.size + ' of them were never examined.'
        : 'At <b>' + cur + '</b>. ' + target + ' is ' + (target < cur ? 'smaller' : 'larger') +
          ', so go <b>' + (target < cur ? 'left' : 'right') + '</b>, and the entire ' +
          (target < cur ? 'right' : 'left') + ' subtree is discarded in that one comparison.';
      const m = $('#f-bst-msg');
      m.className = 'msg ' + (done ? (found ? 'good' : 'bad') : '');
      m.textContent = !done ? 'each comparison discards a whole subtree, which is why the cost is the height'
        : found ? 'The cost was the depth of the value, never the number of nodes.'
          : '15 is not in the tree. The search stops at a leaf: after ' + p.length +
            ' comparisons there is nowhere left to go, which is also how an insert finds its spot.';
      $('#bs-step').disabled = done;
    }
    setPills($('#f-bst'), 'bs', v => { target = +v; k = 0; draw(); });
    $('#bs-step').onclick = () => { k++; draw(); };
    $('#bs-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 8.5 shape depends on insertion order ---- */
  (function () {
    const BAL = [[23, 260, 26], [12, 150, 74], [31, 370, 74], [4, 96, 122], [18, 204, 122],
      [27, 314, 122], [40, 426, 122]];
    const BALE = [[23, 12], [23, 31], [12, 4], [12, 18], [31, 27], [31, 40]];
    const DEG = [4, 12, 18, 23, 27, 31, 40].map((v, i) => [v, 40 + i * 66, 26 + i * 20]);
    const DEGE = [4, 12, 18, 23, 27, 31].map((v, i) => [v, [12, 18, 23, 27, 31, 40][i]]);
    function draw(k) {
      const bal = k === 'bal';
      const N = bal ? BAL : DEG, E = bal ? BALE : DEGE;
      const at = v => N.find(x => x[0] === v);
      let s = '';
      E.forEach(([a, b]) => {
        const p = at(a), c = at(b);
        s += DG.line(p[1], p[2] + 12, c[1], c[2] - 12, { stroke: '#c9c9c4' });
      });
      N.forEach(([v, x, y]) => {
        s += `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${bal ? 'var(--indigo)' : 'var(--terra)'}"/>`;
        s += DG.txt(x, y + 4, String(v), { anchor: 'middle', cls: 'm' });
      });
      s += DG.txt(DG.PAD, 172, bal
        ? 'height 2, so at most 3 comparisons to find anything'
        : 'height 6, so up to 7 comparisons, exactly as slow as linear search', { cls: 'm mu' });
      $('#sh-svg').innerHTML = s;
      $('#sh-hd').textContent = bal ? 'balanced insertion order' : 'already-sorted insertion order';
      $('#sh-h').textContent = bal ? 'height 2' : 'height 6';
      $('#sh-note').innerHTML = bal
        ? 'The middle value went in first, so each half split evenly. Seven nodes fit in a height of 2, and every search costs at most 3 comparisons. Note that <b>23 was inserted first and is the root</b>, which is the quickest check on any insertion-order question.'
        : 'Each value was larger than the last, so each one attached to the <b>right</b> of the previous. The tree is a straight line: height 6, and searching it costs the same as scanning a list. <b>Every advantage of the tree is gone</b>, and nothing about the rules was broken.';
      const m = $('#f-shape-msg');
      m.className = 'msg ' + (bal ? 'good' : 'bad');
      m.textContent = bal
        ? 'Same seven values, same rules. Only the order they arrived in differs.'
        : 'This is why real indexes are self-balancing: sorted input is common, and this is what it would otherwise do.';
    }
    setPills($('#f-shape'), 'sh', draw);
    draw('bal');
  })();

  /* ---- Fig 8.6 disk anatomy ---- */
  (function () {
    const T = {
      pl: 'A <b>platter</b> is a rigid magnetic disc. A drive stacks several, and <b>both surfaces</b> of each are used, so 4 platters give 8 surfaces. That doubling is why the capacity formula multiplies the platter count by 2.',
      tr: 'A <b>track</b> is one concentric ring on one surface. A modern surface holds tens of thousands. The head must be positioned over the right track before anything can be read, and that positioning is the <b>seek</b>.',
      se: 'A <b>sector</b> is an arc of a track, typically 512 bytes, and it is the <b>smallest unit that can be read or written</b>. Wanting a single byte still costs a whole sector, which is why a block size must be a multiple of the sector size.',
      cy: 'A <b>cylinder</b> is the same-numbered track on <b>every</b> surface, stacked vertically. All heads move together, so an entire cylinder is reachable <b>without moving the arm</b>. And since a cylinder is one track position across all surfaces, <b>the number of cylinders equals the number of tracks per surface</b>.',
      hd: 'One <b>read-write head</b> floats over each surface, all mounted on a single <b>arm</b> that swings in and out. Moving it is mechanical and slow, and it is the single largest component of access time.',
      sp: 'The <b>spindle</b> holds all the platters and spins them together at a constant rate, commonly 7200 rpm. Because it never stops or reverses, a sector that has just passed can only be reached by <b>waiting a full revolution</b>, and that wait is the rotational latency.',
    };
    function draw(k) {
      const on = id => k === id;
      const col = id => on(id) ? 'var(--indigo)' : '#c9c9c4';
      let s = DG.txt(DG.PAD, 16, 'side view', { cls: 'm mu' });
      [0, 1, 2].forEach(i => {
        const y = 38 + i * 34;
        s += `<ellipse cx="126" cy="${y}" rx="96" ry="9" fill="${on('pl') ? 'var(--indigo-tint)' : '#fff'}" ` +
          `stroke="${col('pl')}"/>`;
        s += DG.line(206, y - 5, 232, y - 5, { stroke: col('hd'), sw: on('hd') ? 1.8 : 1 });
        s += DG.line(206, y + 5, 232, y + 5, { stroke: col('hd'), sw: on('hd') ? 1.8 : 1 });
      });
      s += DG.line(126, 24, 126, 120, { stroke: col('sp'), sw: on('sp') ? 2.2 : 1.2 });
      s += DG.txt(126, 138, 'spindle', { anchor: 'middle', cls: 'm', fill: on('sp') ? 'var(--indigo)' : 'var(--muted)' });
      s += DG.line(236, 24, 236, 120, { stroke: col('hd'), sw: on('hd') ? 2.2 : 1.2 });
      s += DG.txt(236, 138, 'arm', { anchor: 'middle', cls: 'm', fill: on('hd') ? 'var(--indigo)' : 'var(--muted)' });
      if (on('cy')) {
        s += `<rect x="182" y="26" width="18" height="96" fill="var(--indigo-tint)" stroke="var(--indigo)" stroke-dasharray="3 2"/>`;
        s += DG.txt(191, 138, 'cylinder', { anchor: 'middle', cls: 'm', fill: 'var(--indigo)' });
      }
      s += DG.txt(300, 16, 'one surface, from above', { cls: 'm mu' });
      const cx = 400, cy = 78;
      [56, 42, 28].forEach((r, i) => {
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i === 1 ? col('tr') : '#e5e5e3'}" ` +
          `stroke-width="${i === 1 && on('tr') ? 1.8 : 1}"/>`;
      });
      for (let a = 0; a < 8; a++) {
        const th = (a * Math.PI) / 4;
        s += DG.line(cx + 28 * Math.cos(th), cy + 28 * Math.sin(th),
          cx + 56 * Math.cos(th), cy + 56 * Math.sin(th), { stroke: '#e5e5e3' });
      }
      if (on('se')) {
        s += `<path d="M ${cx + 35} ${cy} A 35 35 0 0 1 ` +
          `${(cx + 35 * Math.cos(Math.PI / 4)).toFixed(1)} ${(cy + 35 * Math.sin(Math.PI / 4)).toFixed(1)}" ` +
          `fill="none" stroke="var(--indigo)" stroke-width="9" opacity="0.5"/>`;
      }
      s += DG.txt(cx, 152, on('se') ? 'one sector highlighted' : 'tracks and sectors',
        { anchor: 'middle', cls: 'm mu' });
      s += DG.txt(DG.PAD, 184, 'the arm swings; the platters spin; both take real time', { cls: 'm mu' });
      $('#dk-svg').innerHTML = s;
      $('#dk-note').innerHTML = T[k] || 'Pick a part of the disk. The two views show the same drive from the side and from above.';
    }
    setPills($('#f-disk'), 'dk', draw);
    draw(null);
  })();

  /* ---- Fig 8.7 capacity ---- */
  (function () {
    function draw() {
      const pl = +$('#cp-pl').value, tr = +$('#cp-tr').value,
        se = +$('#cp-se').value, by = +$('#cp-by').value;
      $('#cp-pl-v').textContent = pl; $('#cp-tr-v').textContent = tr;
      $('#cp-se-v').textContent = se; $('#cp-by-v').textContent = by;
      const surf = pl * 2, perTrack = se * by, perSurf = perTrack * tr, total = perSurf * surf;
      const fmt = b => b >= 1e9 ? (b / 1e9).toFixed(2) + ' GB'
        : b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB'
          : b >= 1e3 ? (b / 1e3).toFixed(1) + ' KB' : b + ' B';
      $('#cp-tbl').innerHTML = '<thead><tr><th>step</th><th>calculation</th><th>result</th></tr></thead><tbody>' +
        [['surfaces', pl + ' platters &times; 2', surf + ' surfaces'],
          ['cylinders', 'equals tracks per surface', tr + ' cylinders'],
          ['bytes per track', se + ' sectors &times; ' + by + ' bytes', fmt(perTrack)],
          ['bytes per surface', fmt(perTrack) + ' &times; ' + tr + ' tracks', fmt(perSurf)],
          ['total capacity', fmt(perSurf) + ' &times; ' + surf + ' surfaces', fmt(total)]]
          .map((r, i) => `<tr class="${i === 4 ? 'hi' : i === 1 ? 'cu' : ''}"><td>${r[0]}</td>` +
            `<td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') + '</tbody>';
      $('#cp-tot').textContent = fmt(total);
      $('#cp-note').innerHTML = 'Two things to watch. <b>Surfaces = platters &times; 2</b>, since both ' +
        'sides are used, and forgetting the 2 halves the answer. And <b>cylinders = tracks per ' +
        'surface</b>, here <b>' + tr + '</b>: multiplying that by the surface count is the standard ' +
        'wrong answer.';
      $('#f-cap-msg').textContent = 'the number of surfaces is twice the number of platters, and the number of cylinders is not';
    }
    ['cp-pl', 'cp-tr', 'cp-se', 'cp-by'].forEach(id => { $('#' + id).oninput = draw; });
    draw();
  })();

  /* ---- Fig 8.8 access time ---- */
  (function () {
    function draw() {
      const sk = +$('#tm-sk').value, rp = +$('#tm-rp').value,
        kb = +$('#tm-kb').value, rate = +$('#tm-dr').value;
      $('#tm-sk-v').textContent = sk; $('#tm-rp-v').textContent = rp;
      $('#tm-kb-v').textContent = kb; $('#tm-dr-v').textContent = rate;
      const rev = 60000 / rp;
      const lat = rev / 2;
      const xf = (kb / rate) * 1000;
      const access = sk + lat;
      const tot = access + xf;
      const P = [['seek', sk, 'var(--terra)'], ['rotational latency', lat, 'var(--indigo)'],
        ['transfer', xf, 'var(--green)']];
      let x = DG.PAD, s = '';
      const W = DG.W - 2 * DG.PAD;
      P.forEach(([n, v, c]) => {
        const w = Math.max(1, (v / tot) * W);
        s += `<rect x="${x.toFixed(1)}" y="30" width="${w.toFixed(1)}" height="26" fill="${c}" opacity="0.72"/>`;
        x += w;
      });
      s += `<rect x="${DG.PAD}" y="30" width="${W}" height="26" fill="none" stroke="#e5e5e3"/>`;
      P.forEach(([n, v, c], i) => {
        s += `<rect x="${DG.PAD + i * 172}" y="70" width="9" height="3" fill="${c}"/>`;
        s += DG.txt(DG.PAD + 14 + i * 172, 75, n, { cls: 'm mu' });
        s += DG.txt(DG.PAD + 14 + i * 172, 89, v.toFixed(2) + ' ms  (' +
          ((v / tot) * 100).toFixed(0) + '%)', { cls: 'm mu' });
      });
      s += DG.txt(DG.PAD, 22, 'one read of ' + kb + ' KB at ' + rate + ' KB/s', { cls: 'm mu' });
      $('#tm-svg').innerHTML = s;
      $('#tm-tbl').innerHTML = '<thead><tr><th>component</th><th>how it is worked out</th><th>ms</th></tr></thead><tbody>' +
        [['seek time', 'given as the average', sk.toFixed(3)],
          ['rotational latency', '(60000 / ' + rp + ' rpm) / 2, half a revolution', lat.toFixed(3)],
          ['<b>access time</b>', '<b>seek + latency</b>, request to start of transfer', '<b>' + access.toFixed(3) + '</b>'],
          ['transfer time', kb + ' KB / ' + rate + ' KB per sec', xf.toFixed(3)],
          ['<b>total disk access time</b>', '<b>access time + transfer</b>', '<b>' + tot.toFixed(3) + '</b>']]
          .map((r, i) => `<tr class="${i === 4 ? 'hi' : i === 2 ? 'cu' : ''}"><td>${r[0]}</td>` +
            `<td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') + '</tbody>';
      $('#tm-hd').textContent = 'reading ' + kb + ' KB at ' + rp + ' rpm';
      $('#tm-tot').textContent = tot.toFixed(3) + ' ms total';
      const waitPct = (access / tot) * 100;
      $('#tm-note').innerHTML = '<b>Access time</b> is ' + access.toFixed(2) + ' ms: that is what ' +
        '"from the request being issued to when the transfer begins" means, and it <b>excludes</b> ' +
        'the transfer. Adding the transfer gives the <b>total</b> of ' + tot.toFixed(2) + ' ms. ' +
        'Seek and latency are paid <b>once per read</b> no matter how much you then read.';
      $('#f-time-msg').textContent = waitPct > 60
        ? 'Most of the time is pure waiting. Push the data size up and watch the waiting share fall, which is exactly why databases read in blocks.'
        : 'Now transfer dominates, because the fixed costs have been amortised over a large read.';
    }
    ['tm-sk', 'tm-rp', 'tm-kb', 'tm-dr'].forEach(id => { $('#' + id).oninput = draw; });
    draw();
  })();

  /* ---- Fig 8.9 buffer replacement ---- */
  (function () {
    const REQ = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 4];
    let pol = 'lru', frames = 3, upto = 1;
    function run(n, policy) {
      const buf = [], used = new Map(), log = [];
      let hits = 0;
      for (let i = 0; i < n; i++) {
        const b = REQ[i];
        let ev = null;
        const hit = buf.includes(b);
        if (hit) hits++;
        else {
          if (buf.length >= frames) {
            let pick = buf[0];
            buf.forEach(x => {
              if (policy === 'lru' ? used.get(x) < used.get(pick) : used.get(x) > used.get(pick)) pick = x;
            });
            ev = pick;
            buf.splice(buf.indexOf(pick), 1);
          }
          buf.push(b);
        }
        used.set(b, i);
        log.push({ i, b, hit, ev, snap: buf.slice() });
      }
      return { log, hits };
    }
    function draw() {
      const n = Math.max(1, upto);
      const { log, hits } = run(n, pol);
      const other = run(n, pol === 'lru' ? 'mru' : 'lru').hits;
      const misses = n - hits;
      $('#bf-tbl').innerHTML = '<thead><tr><th>#</th><th>request</th>' +
        Array.from({ length: frames }, (_, i) => `<th>frame ${i + 1}</th>`).join('') +
        '<th>result</th><th>evicted</th></tr></thead><tbody>' +
        log.map((l, j) => `<tr class="${j === log.length - 1 ? 'cu' : ''}">` +
          `<td>${l.i + 1}</td><td><b>${l.b}</b></td>` +
          Array.from({ length: frames }, (_, i) => {
            const v = l.snap[i];
            return `<td${v === l.b ? ' class="hl"' : ''}>${v === undefined ? '' : v}</td>`;
          }).join('') +
          `<td style="color:${l.hit ? 'var(--green)' : 'var(--terra)'}">${l.hit ? 'hit' : 'miss'}</td>` +
          `<td>${l.ev === null ? '' : l.ev}</td></tr>`).join('') + '</tbody>';
      $('#bf-pol').textContent = (pol === 'lru' ? 'least recently used' : 'most recently used') +
        ', ' + frames + ' frames';
      $('#bf-stat').textContent = hits + ' hits, ' + misses + ' misses, ratio ' + (hits / n).toFixed(2);
      const last = log[log.length - 1];
      $('#bf-note').innerHTML = last.hit
        ? 'Request <b>' + last.b + '</b> was already in the buffer: a <b>hit</b>, costing nothing. ' +
          'It is also now the <b>most recently used</b>, which under MRU makes it the next block to be ' +
          'evicted. This is why MRU is not the same as "last in, first out".'
        : 'Request <b>' + last.b + '</b> was not in the buffer: a <b>miss</b>, costing a disk read of about 10 ms. ' +
          (last.ev !== null
            ? 'Block <b>' + last.ev + '</b> was evicted because it was the ' +
              (pol === 'lru' ? 'least' : 'most') + ' recently used.'
            : 'A free frame was available, so nothing had to be evicted.');
      $('#bf-f-v').textContent = frames;
      $('#bf-step').disabled = upto >= REQ.length;
      const m = $('#f-buf-msg');
      m.className = 'msg ' + (hits > other ? 'good' : hits < other ? 'bad' : '');
      m.textContent = upto < REQ.length
        ? 'a hit costs nothing; a miss costs a disk read'
        : hits === other
          ? 'Both policies reach ' + hits + ' hits on this sequence with ' + frames +
            ' frames. Neither is universally better: you have to work out the ratio for the sequence in front of you.'
          : (pol === 'lru' ? 'LRU' : 'MRU') + ' gets ' + hits + ' hits here where ' +
            (pol === 'lru' ? 'MRU' : 'LRU') + ' gets ' + other +
            '. Switch policies and compare; the winner depends entirely on the request sequence.';
    }
    setPills($('#f-buf'), 'bf', v => { pol = v; draw(); });
    $('#bf-f').oninput = () => { frames = +$('#bf-f').value; draw(); };
    $('#bf-step').onclick = () => { if (upto < REQ.length) upto++; draw(); };
    $('#bf-all').onclick = () => { upto = REQ.length; draw(); };
    $('#bf-reset').onclick = () => { upto = 1; draw(); };
    draw();
  })();
}
</script>

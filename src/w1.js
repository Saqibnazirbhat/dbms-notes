<script>
function renderWeek1() {
  return chead('week-1') + `<article>

<section>
<h2>1. Data, Database, and Database System</h2>
<p>Three words that get used as if they meant the same thing. They do not, and almost every
confusion later in the course starts here.</p>
${teach('Data', 'the raw facts', [
  'Raw facts and figures, on their own, with nothing attached to say what they mean.',
  'Because everything a computer stores is ultimately made of these, and it is worth being clear that they carry no meaning by themselves.',
  'Three scraps of paper on a desk reading <code>Rahul</code>, <code>101</code>, <code>9.0</code>. You cannot say what any of them is <i>about</i>.',
  'A single value in a single cell of a single table.',
  'Data is not information. It becomes information only once you know which fact it records.',
  'Raw, unprocessed values, without context or interpretation.',
])}
${teach('Database', 'the organised collection', [
  'An organised collection of related data, stored so it can be found again.',
  'Because scattered facts are useless. Put them in labelled columns and rows and suddenly you can ask questions.',
  'A school register. Ruled columns, one line per student, every line about the same kind of thing.',
  'Once you know 101 is a student id, Rahul is that student&rsquo;s name and 9.0 is that student&rsquo;s CGPA, you can answer questions.',
  'A database is <b>data</b>, not software. IIT Madras has a student database; that database is not a DBMS.',
  'A collection of interrelated data representing some aspect of the real world.',
])}
${teach('DBMS', 'database management system', [
  'The <b>software</b> that stores, manages, retrieves, updates and organises the data for you.',
  'Because the data has to be kept safe, correct and quick to search, and doing all of that by hand in your own program is enormous work you would get wrong.',
  'The librarian, not the library. The books are the database; the person who files, finds and protects them is the DBMS.',
  'PostgreSQL, MySQL, Oracle, Microsoft SQL Server, Microsoft Access, Sybase. This course uses <b>PostgreSQL</b> through pgAdmin.',
  'You send it a request, it finds or changes the data on disk, and it sends back an answer, while enforcing every rule you gave it.',
  'A collection of interrelated data <b>together with</b> the programs used to access and manage that data.',
])}
<p>The distinction is tested directly. <b>Microsoft Excel is not a DBMS</b>: it is spreadsheet
software. <b>Google Docs is not a DBMS</b> either: it is a cloud word processor. Both are
application software; neither manages a database.</p>
<p>One more label to keep straight. An <b>RDBMS</b> is a <i>relational</i> DBMS, one that holds its
data in tables. It is a <b>kind</b> of DBMS, not another word for it. There are also
non-relational, "NoSQL" systems.</p>
<p>You are already inside dozens of these. Opening a bank account, buying a flight ticket, being
enrolled as a student: each one is a row in somebody&rsquo;s database, with a DBMS in front of
it.</p>
</section>

<section>
<h2>2. The First Instinct: Just Use a File</h2>
<p>Suppose you write a Python program that takes input, processes it, and must remember the result
after the computer is switched off. What do you reach for?</p>
<p>Almost everyone answers the same way: <b>write it to a file</b>. A text file, a CSV, an Excel
sheet. Python can also write whole <b>objects</b> to a file, which keeps related fields together in
one item, and for a small job that genuinely is the right answer.</p>
<p>So the honest question is not "is a file bad?" It is: <b>at what point does a file stop being
enough?</b> The rest of this chapter answers that, and the answer is what a DBMS is for.</p>
<p>The lecture works through one concrete case study, and it is worth following closely because
every later idea comes out of it.</p>
${wex('The case study: a bank transaction system',
'<p style="margin:0 0 8px">Two accounts. Money leaves one and arrives at the other, and a ledger ' +
'records what happened. Written twice, once with files and once with a database.</p>' +
mini(['what it holds', 'file version', 'DBMS version'],
  [['the accounts', 'accounts.csv', 'accounts table'],
   ['the transaction history', 'ledger.csv', 'ledger table']]) +
'<p style="margin:8px 0 0">A <b>table</b> here means rows and columns: the accounts table might ' +
'have customer id, account number, balance and account type as columns, and one row per account ' +
'holder. A database is, crudely, a collection of such tables plus the relationships and ' +
'constraints between them.</p>')}
<p>Two differences show up before any data is even at risk.</p>
<dl class="tight">
  <dt>You must open the file, and you must remember to close it</dt>
  <dd>Every read and write is wrapped in file handling. With a DBMS you never say <i>where</i> to
  write. You say what you want stored, and the system puts it in the right place by itself.</dd>
  <dt>You must decide how to lay the data out</dt>
  <dd>With a file you invent your own format, and every program that touches it must agree. A DBMS
  fixes the structure once and enforces it on everybody.</dd>
</dl>
</section>

<section>
<h2>3. Where the File Breaks: One Money Transfer</h2>
<p>Transferring 500 rupees is not one action. It is <b>two</b>.</p>
<pre><code><span class="cm"># the file version, in Python</span>
acct[<span class="st">'A'</span>][<span class="st">'balance'</span>] = acct[<span class="st">'A'</span>][<span class="st">'balance'</span>] - 500   <span class="cm"># debit</span>
<span class="cm">#  &larr; critical point</span>
acct[<span class="st">'B'</span>][<span class="st">'balance'</span>] = acct[<span class="st">'B'</span>][<span class="st">'balance'</span>] + 500   <span class="cm"># credit</span></code></pre>
<p>The commented line is the whole problem. Between the debit and the credit there is a moment when
the money exists <b>nowhere</b>. If the power fails there, or the machine crashes, or the network
drops, the first write is already saved and the second never happens. Five hundred rupees have been
destroyed.</p>
<p>You might object that the gap is a fraction of a millisecond. How unlucky would you have to be?
But a real bank runs thousands of these at the same moment, all day, for years, and at that scale
the unlikely becomes routine.</p>
<p>You have almost certainly seen the correct behaviour without noticing. A payment fails halfway
through, you get a message saying the money will be returned within a few working days, and it comes
back without you doing anything at all. Something noticed the transfer never finished and undid the
half that had.</p>
${fig('f-atom',
`<div class="panel">
  <div class="phead"><span class="m" id="atom-mode-l"></span><span class="m" id="atom-tot"></span></div>
  <div class="cols">
    <div style="flex:1;min-width:210px"><div id="atom-code" style="font-family:var(--mono);font-size:11.5px;line-height:1.85"></div></div>
    <div><div class="tname">accounts</div><table class="dt" id="atom-tbl"></table></div>
  </div>
  <div class="msg" id="atom-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 1.1, The same transfer, twice. Run it to the end and both look identical. Crash it at the critical point and they part company.',
`<span class="lab">version:</span>${pills('atom', [['file', 'file'], ['db', 'database']], 0)}
 <button class="btn" id="atom-play">Run it</button><button class="btn" id="atom-step">Step</button>
 <button class="btn" id="atom-crash">Cut the power now</button>
 <button class="btn" id="atom-reset">Reset</button>`,
'run it to the end and both versions agree')}
<p>And it is worth being fair about how the database does it: <b>there is no magic</b>. A DBMS is
itself written in an ordinary language like C, C++ or Java. Somebody wrote the code that notices a
half-finished transfer and rolls it back. The point is that they wrote it once, correctly, and you
inherit it. In your own script you would have to build that yourself, and if the script dies mid-way
there is nothing left running to do the checking.</p>
</section>

<section>
<h2>4. The Four Guarantees</h2>
<p>What the database gives you instead is four promises, known by the initials <b>ACID</b>. They
apply to every <b>transaction</b>, and Week 10 is spent on them. Here is enough to use the words
correctly.</p>
${teach('Transaction', 'one unit of work', [
  'A group of database operations treated as a single, indivisible unit of work.',
  'Because real actions almost never map to one step, and a crash between steps would otherwise leave the data telling a lie, like money existing nowhere.',
  'Sending a letter. Either it is posted and delivered, or it never left your hand. There is no state where it is halfway.',
  'The debit and the credit, together, are one transaction.',
  'The test is simple: <b>does it change stored data?</b> Transferring funds, booking a railway reservation and updating your KYC are transactions. <b>Buying a bigger hard disk is not</b>: you added hardware, and no stored data changed.',
  'A unit of program execution that accesses and possibly updates various data items.',
])}
${teach('Atomicity', 'all or nothing', [
  'A transaction happens completely, or it does not happen at all. There is no half.',
  'Because that is exactly what section 3 broke. Without it, a crash between two writes leaves the data in a state that was never true.',
  'The word comes from the old sense of <i>atom</i>: the thing that cannot be cut. "Atomic" here means unbreakable, unhindered.',
  'If the credit fails, the debit is <b>rolled back</b> and the money reappears in the sender&rsquo;s account.',
  'The system keeps enough information to undo a partial transaction, and undoes it automatically on failure.',
  'Either all operations of the transaction are reflected in the database, or none are.',
])}
${teach('Consistency', 'the rules always hold', [
  'A transaction moves the database from one <b>valid</b> state to another valid state, never to a state that breaks a declared rule.',
  'Because the same fact often appears in more than one place, and updating one copy but not the others leaves the database contradicting itself.',
  'You join a university, and later switch from Computer Science to Data Science. If the department is updated in one table but not another, the database now holds two different answers about the same person.',
  'The DBMS checks every declared rule (primary keys, foreign keys, value checks) at the end of the transaction and refuses to commit if any rule is broken.',
  'Notice that <b>you</b> declare the rules. The database enforces them; it cannot invent them.',
  'Execution of a transaction in isolation preserves the consistency of the database.',
])}
${teach('Isolation', 'as if you were alone', [
  'Concurrent transactions do not see each other&rsquo;s half-finished work.',
  'Because a file cannot really be edited by two people at once, while a bank has thousands of simultaneous transfers and every one must behave as though it ran alone.',
  'Two people withdrawing from the same joint account at the same moment. Neither should be locked out, and neither should see the other mid-withdrawal.',
  'You and a parent both debit the same account at the same instant, and the final balance is correct.',
  'The <b>concurrency control manager</b> does this, by ordering the conflicting operations. Week 10 calls the property <b>serializability</b>.',
  'Concurrent execution leaves the database in a state equivalent to some serial execution of the same transactions.',
])}
${teach('Durability', 'once committed, it stays', [
  'Once a transaction reports success, its changes survive, even a power failure one second later.',
  'Because "saved" has to mean something. Memory empties when the power goes, and a promise that evaporates is not a promise.',
  'Writing in permanent ink rather than pencil. It will not fade on its own an hour later.',
  '<code>COMMIT</code> is the command that ends a transaction successfully. After it returns, the change is permanently stored.',
  'Durability requires the change to reach the <b>disk</b>, which is why Chapter 8 spends so long on disks.',
  'After successful completion, the changes persist even if there are system failures.',
])}
<p>One clarification the lecture makes, because it confuses people. <b>Durability is not the reason
we left file systems.</b> Data in a file is durable too; it does not evaporate. What files lack is
atomicity, isolation, enforced consistency and security.</p>
${fig('f-acid',
`<div class="panel">
  <div class="phead"><span class="m" id="ac-name"></span><span class="m" id="ac-one"></span></div>
  <table class="dt" id="ac-tbl"></table>
  <div class="msg" id="ac-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 1.2, Each guarantee, and the exact failure it prevents.',
`<span class="lab">property:</span>${pills('ac', [['a', 'Atomicity'], ['c', 'Consistency'], ['i', 'Isolation'], ['d', 'Durability']], 0)}`,
'each letter blocks one specific way the data could start lying')}
</section>

<section>
<h2>5. Everything Else a File Cannot Do</h2>
<p>Atomicity is the sharpest failure, but not the only one. Here is the full comparison, and it is
asked about directly.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Factor</th><th>File system</th><th>DBMS</th></tr></thead>
<tbody>
<tr><td><b>Redundancy</b></td><td>The same fact is duplicated across many files</td><td>Reduced deliberately, by <b>normalization</b> (Chapter 6)</td></tr>
<tr><td><b>Consistency</b></td><td>Copies drift apart, and nothing checks them</td><td>Rules are declared once and enforced on every write</td></tr>
<tr><td><b>Integrity</b></td><td>You write the checks yourself, in every program</td><td>Constraints live in the database, so every program obeys them</td></tr>
<tr><td><b>Atomicity</b></td><td>None. A crash mid-way leaves a half-state</td><td>Guaranteed. All or nothing</td></tr>
<tr><td><b>Concurrent access</b></td><td>Hard. Editing usually locks other users out</td><td>Many users at once, safely</td></tr>
<tr><td><b>Security</b></td><td>Whole-file permissions at best</td><td>Per-user, per-table, per-column access rules</td></tr>
<tr><td><b>Retrieval speed</b></td><td>Scan the whole file</td><td>Indexes and a query optimizer</td></tr>
<tr><td><b>Recovery</b></td><td>Whatever you built yourself</td><td>Logging and recovery built in (Week 11)</td></tr>
<tr><td><b>Ease of initial setup</b></td><td><b>Easier.</b> Open a file and write</td><td><b>Harder.</b> Install, design a schema, administer it</td></tr>
</tbody></table></div>
<p>That last row is the one people get wrong. <b>Ease of setup is an advantage of file systems, not
a drawback.</b> A DBMS carries real overhead, so for a genuinely small dataset a file is the better
engineering choice. The drawbacks of file systems are inconsistent data, lack of data integrity and
difficulty supporting concurrency, and a DBMS exists to fix those.</p>
<p>Two claims that sound plausible and are <b>false</b>, both worth rebutting explicitly:</p>
<dl class="tight">
  <dt>"A DBMS is an efficient platform for doing complex arithmetic computation on the data."</dt>
  <dd><b>False.</b> A DBMS is built to <i>store, protect and retrieve</i> data. Heavy computation
  belongs in a program that pulls the data out and works on it, which is exactly what Chapter 7 is
  about.</dd>
  <dt>"It is easier to create access rules in a file system than in a DBMS."</dt>
  <dd><b>False</b>, and backwards. A DBMS lets you build a whole hierarchy of user levels, each with
  different powers, the way a Linux system gives different users different rights. A file system
  offers little more than permissions on the file as a whole.</dd>
</dl>
<p>So when is a DBMS the right choice? <b>Large datasets</b> and <b>concurrent transactions</b> are
the two clear signals. It is <i>not</i> preferred for tiny datasets, where the overhead is not worth
it, and it is a poor idea with <b>no dedicated administrator</b>, because an unmaintained database
degrades as it grows.</p>
${fig('f-cost',
`<div class="panel">
  <div class="phead"><span class="m">finding one record</span><span class="m" id="sc-n"></span></div>
  <table class="dt" id="sc-tbl"></table>
  <div class="msg" id="sc-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 1.3, Scanning a file against an indexed lookup. The gap is not a fixed multiple; it widens as the data grows.',
`${slider('sc-s', 1, 200, 1, 20, 'records (thousands)')}`,
'a scan grows with the data; an indexed lookup barely does')}
</section>

<section>
<h2>6. Three Levels of Abstraction</h2>
<p>A database is described at three levels at once. The whole point is that somebody working at one
level does not have to understand the others.</p>
${teach('Abstraction', 'hiding what you do not need', [
  'Deliberately hiding detail, so that each person sees only what their job requires.',
  'Because a database is enormous, and forcing everyone to understand all of it would make it unusable and unsafe.',
  'Driving a car. The pedals and steering wheel are all you touch. The pistons and gearbox are real but hidden, and you drive perfectly well without knowing them.',
  'A bank clerk sees your balance. They do not see, and must not see, the file layout on disk.',
  'The three levels are stacked: view on top, logical in the middle, physical at the bottom.',
  'Suppression of implementation detail behind a defined interface.',
])}
${teach('View level', 'also called the external schema', [
  'What a <b>particular user</b> is allowed to see: a chosen slice of the database, and nothing else.',
  'Because different people need different parts, and some parts must be hidden for privacy or security.',
  'A menu in a restaurant. It shows the dishes you may order, not the kitchen, the supplier invoices or the staff rota.',
  'If a table has 100 rows and a user should see 10, you give them a <b>view</b> showing exactly those 10.',
  'Realised with <code>CREATE VIEW</code> (Chapter 3). A database has <b>one</b> logical schema but <b>many</b> view schemas, one per group of users.',
  'The highest level of abstraction, because it hides the most.',
])}
${teach('Logical level', 'also called the conceptual schema', [
  'A description of <b>what data exists</b> and how it relates: the tables, their columns, their types, their keys, their constraints, and the relationships between tables.',
  'Because somebody has to decide the structure, and that decision is independent of both who is looking and how bytes sit on a disk.',
  'The floor plan of a building. It says what rooms exist and how they connect, without specifying the bricks.',
  'Deciding that <code>student</code> has id, name and CGPA, that id is the primary key, and that <code>takes</code> references it with a foreign key.',
  '<b>Deciding which attribute goes in which table, and which attribute is the primary key, are logical-level decisions.</b>',
  'A description of the entire database in terms of a data model.',
])}
${teach('Physical level', 'also called the internal schema', [
  'How the data is <b>actually stored on the disk</b>: files, blocks, and the data structures holding them.',
  'Because someone must make it fast, and that is a completely different problem from deciding what the data means.',
  'The wiring and plumbing behind the walls. Essential, and nobody living there thinks about it.',
  'Whether an index is stored as a B tree or a B+ tree is a physical-level decision (Week 9).',
  '<b>A programmer working on the internal data structures that store data is working at the physical level.</b>',
  'The lowest level of abstraction, because it hides nothing.',
])}
<p>Two points people reverse. <b>Which level is "highest"?</b> The <b>view</b> level. Abstraction
measures <i>how much is hidden</i>: the physical level hides nothing at all, so it is the lowest,
and the view level hides the most, so it is the highest.</p>
<p>And the physical level matters because of a hardware fact worth knowing now, since Chapter 8
returns to it. <b>Main memory is fast, small, expensive and forgetful</b>: switch the power off and
it is empty. <b>Disk is slow, large, cheap and permanent.</b> A database is far too big and far too
valuable to live in main memory, so it lives on disk, and everything about the physical level
follows from that.</p>
${fig('f-lv',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 150" id="lv-svg"></svg>
  <div class="msg" id="lv-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 1.4, The three levels, and who works at each.',
`<span class="lab">level:</span>${pills('lv', [['v', 'view'], ['l', 'logical'], ['p', 'physical']], -1)}`,
'abstraction measures how much is hidden, so the view level is the highest')}
</section>

<section>
<h2>7. Schema, Instance, and Metadata</h2>
${teach('Schema', 'the structure', [
  'The <b>design</b> of the database: which tables exist, which columns they have, what types those columns hold, and what rules apply.',
  'Because the structure must be agreed before any data can be stored, and everything written afterwards has to obey it.',
  'The blueprint of a building. It says where the rooms go. It is not the furniture.',
  '<code>student(id, name, cgpa)</code>: three columns, with <code>id</code> as the identifier.',
  'It <b>rarely changes</b>. You create it once with <code>CREATE TABLE</code> and alter it only when something structural genuinely changes.',
  'The overall design of the database, at any one of the three levels.',
])}
${teach('Instance', 'the contents right now', [
  'The <b>actual data</b> in the database at one particular moment.',
  'Because the same design holds completely different contents on different days, and you need separate words for the two.',
  'The word means the same as in "an instant of time": any particular moment.',
  '<code>(101, Rahul, 9.0)</code> is one row of the instance. Tomorrow that row may be gone.',
  'It <b>changes constantly</b>, with every insert, update and delete.',
  'The collection of data stored in the database at a particular moment.',
])}
${wex('The same table, five days apart',
'<p style="margin:0 0 8px">An employee leaves and their row is deleted.</p>' +
mini(['', 'five days ago', 'today'],
  [['schema', 'employee(id, name, dept)', 'employee(id, name, dept)'],
   ['instance', '3 rows, including yours', '2 rows, yours removed']]) +
'<p style="margin:8px 0 0">The <b>schema is identical</b>: same columns, same types, same rules. ' +
'Only the instance moved. That is the whole distinction.</p>')}

<h3>Constraints are part of the schema</h3>
<p>A schema is not only a list of columns. It also carries <b>rules</b>, and this is where a
database stops being a spreadsheet.</p>
<p>Declare that <code>id</code> is the primary key and no two rows may share an id. Declare that
CGPA must lie between 0 and 10 and no program can ever store 47. The database refuses the row that
breaks a rule and tells you why. Not sometimes, not depending on which program is writing. Always,
for everybody.</p>
${fig('f-sch',
`<div class="panel">
  <div class="phead"><span class="m">student(id, name, cgpa)</span><span class="m" id="sch-cnt"></span></div>
  <table class="dt" id="sch-tbl"></table>
  <div class="msg" id="sch-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 1.5, Trying to insert rows that break the declared rules. No application code is doing the checking.',
`<span class="lab">try inserting:</span>${pills('sch', [['ok', '104, Nita, 8.2'], ['dup', '101, Zoya, 7.0'], ['bad', '105, Amit, 47'], ['null', 'NULL, Ravi, 6.5']], -1)}`,
'the rules live in the database, so every program obeys them')}

<h3>Metadata and the data dictionary</h3>
<p><b>Metadata is data about data.</b> That one line is the whole definition. Where the data says
"Rahul", the metadata says "there is a column called <code>name</code>, it holds text, and it belongs
to the <code>student</code> table".</p>
<p>It lives in the <b>data dictionary</b>, also called the system catalog: a set of tables the
database keeps about itself.</p>
<p>Schema and metadata overlap heavily and are often used interchangeably. If you want the
distinction: the <b>schema is the structural blueprint</b>, while <b>metadata is the broader, more
descriptive information</b> about the data. Both describe the database rather than being its
contents.</p>
</section>

<section>
<h2>8. Data Independence</h2>
<p>Now the payoff of having three levels.</p>
${teach('Data independence', 'change one level, leave the others alone', [
  'The ability to change one level of the schema without having to change the levels above it.',
  'Because otherwise every performance tweak deep in storage would break every application, and nobody could ever improve anything.',
  'Rewiring a house without changing where the light switches are. The residents notice nothing.',
  'Switching an index from a B tree to a B+ tree changes storage completely, and no query has to be rewritten.',
  'The rule is one-directional: <b>a change at a lower level must not affect the levels above it.</b> Lower levels may well be affected by changes above.',
  'Immunity of the higher-level schemas to changes in lower-level schemas.',
])}
<div class="tw"><table class="pt">
<thead><tr><th>Kind</th><th>You change</th><th>Must not affect</th><th>May affect</th></tr></thead>
<tbody>
<tr><td><b>Physical data independence</b></td><td>the physical level</td><td><b>logical and view</b></td><td>nothing above it</td></tr>
<tr><td><b>Logical data independence</b></td><td>the logical level</td><td><b>view</b></td><td>the physical level</td></tr>
</tbody></table></div>
<p>That table answers the standard question directly. "A change in the physical level should not
affect which levels?" <b>Both logical and view.</b> "A change in the logical level should not affect
which level?" <b>The view level only.</b></p>
${wex('Physical independence, concretely',
'<p style="margin:0 0 8px">Suppose a B+ tree currently stores <b>3 records per node</b>, and a ' +
'storage engineer changes it to <b>5 records per node</b> to make searches faster.</p>' +
'<p style="margin:0 0 8px">That change rewrites the entire tree and the whole memory layout on ' +
'disk. Yet the bank clerk querying for Sarita&rsquo;s record sees <b>exactly the same table on ' +
'screen as before</b>. They do not even know anything happened.</p>' +
'<p style="margin:0">Think of each level as a black box. Change the machinery inside the box and ' +
'the result the box produces is unchanged. Only the speed of producing it changed, which is ' +
'precisely why you would make the change at all.</p>')}
${wex('Logical independence, concretely',
'<p style="margin:0 0 8px">Now split the <code>name</code> column of <code>student</code> into ' +
'<code>first_name</code> and <code>last_name</code>. That is a logical-level decision.</p>' +
'<p style="margin:0">The <b>view level must be unaffected</b>: a user who only ever saw a full ' +
'name still sees one, because the view can join the two columns back together. The <b>physical ' +
'level will be affected</b>, and that is fine and expected: a new column is new data, so the ' +
'storage has to be rearranged. Independence only ever protects <i>upwards</i>.</p>')}
${fig('f-ind',
`<div class="panel">
  <div class="phead"><span class="m" id="ind-hd"></span><span class="m" id="ind-verd"></span></div>
  <svg class="d" viewBox="0 0 520 132" id="ind-svg"></svg>
  <div class="msg" id="ind-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 1.6, A change at one level, and how far its effects are allowed to travel.',
`<span class="lab">change made at:</span>${pills('ind', [['p', 'physical level'], ['l', 'logical level'], ['v', 'view level']], 0)}`,
'a change must never disturb the levels above it')}
${cyu('A storage engineer changes how records are laid out inside a disk block. Must the view level be unaffected? Must the logical level?',
'<b>Both must be unaffected.</b> This is a change at the <b>physical</b> level, and physical data independence says a physical change must not affect the logical or the view level. Contrast it with a <b>logical</b> change, such as adding a column: that must leave the view level alone, but it <i>will</i> change the physical level, because new data needs new storage. Independence protects upwards only.')}
</section>

<section>
<h2>9. Ways of Describing Data</h2>
<p>A <b>data model</b> is a way of describing what data looks like and how it connects. Several
exist. Only one matters for the rest of this course, but you should recognise the others by
name.</p>
${teach('Relational model', 'the one this course uses', [
  'Data is held in <b>two-dimensional tables</b>: rows and columns. Each table is called a <b>relation</b>, which is where the name comes from.',
  'Because it is simple, has solid mathematics behind it (Chapter 4), and turns out to be enough for almost everything.',
  'A stack of school registers, where one register can point at another by writing down an id.',
  'PostgreSQL, MySQL and Oracle are all relational. Everything from Chapter 2 onward assumes it.',
  'Rows are also called <b>tuples</b>, and columns are also called <b>attributes</b>.',
  'Data represented as a collection of relations, each a set of tuples over named attributes.',
])}
<div class="tw"><table class="pt">
<thead><tr><th>Model</th><th>Shape</th><th>Best at</th></tr></thead>
<tbody>
<tr><td><b>Relational</b></td><td>Tables of rows and columns</td><td>Almost everything. <b>This is the one to know.</b></td></tr>
<tr><td><b>Object-relational</b></td><td>Tables, extended with object types</td><td>Data that does not flatten neatly into columns</td></tr>
<tr><td><b>XML</b></td><td>Nested, self-describing tags</td><td><b>Exchanging data between different systems over the Internet</b></td></tr>
<tr><td><b>Graph</b></td><td>Nodes joined by edges</td><td>Densely interconnected data whose connections change constantly</td></tr>
</tbody></table></div>
<p>The graph model has a memorable motivating example. On a social network, one person is connected
to some number of friends, and those connections are <b>not fixed</b>: you gain followers, you lose
friends, and the shape of the network changes every day. Every entity is interconnected, which is
why any two people turn out to be a handful of hops apart. Data shaped like that, where the
<i>semantics of the interconnection change dynamically</i>, is what the graph model is for.</p>
<p>XML earns its one line because of the exchange point: it is self-describing, so a system that has
never seen your data before can still read its structure.</p>
<p>One more model is used at design time rather than storage time. The <b>entity-relationship
model</b> is a high-level picture of the entities and the relationships between them, drawn during
<b>planning and design</b>, before any table exists. Chapter 4 is devoted to it.</p>
</section>

<section>
<h2>10. The Two Kinds of Command</h2>
<p>SQL commands split into families, and the first question about them is always the same: which
family does this command belong to?</p>
${teach('DDL', 'data definition language', [
  'The commands that define and change the <b>structure</b>: the schema.',
  'Because before you can store anything you must say what shape it takes, and later you sometimes need to change that shape.',
  'Ruling the columns on a blank register before anyone writes in it.',
  '<code>CREATE TABLE</code>, <code>ALTER TABLE</code>, <code>DROP TABLE</code>.',
  '<b>DDL creates and maintains the schema of the database.</b> And executing a DDL command <b>modifies the data dictionary</b>, since the system must record the new structure.',
  'The language for specifying the database schema.',
])}
${teach('DML', 'data manipulation language', [
  'The commands that change or retrieve the <b>contents</b>: the instance.',
  'Because a structure with nothing in it is useless, and the whole point is to put data in and get answers out.',
  'Writing entries into the register you just ruled, and reading them back.',
  '<code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>.',
  'This is where you spend most of your time. Chapters 2 and 3 are almost entirely DML.',
  'The language for accessing and manipulating the data organised by the data model.',
])}
<p>The basic shape of every query you will write for the next two chapters:</p>
<pre><code><span class="kw">SELECT</span> name        <span class="cm">-- which columns you want back</span>
<span class="kw">FROM</span>   student     <span class="cm">-- which table they live in</span>
<span class="kw">WHERE</span>  id = 101;   <span class="cm">-- which rows to keep</span></code></pre>
<p>A third family exists and is mentioned only briefly in this course. <b>DCL</b>, data control
language, handles security and permissions: <code>GRANT</code> and <code>REVOKE</code>. It is not
examined here, but knowing the name lets you rule it out of a multiple-choice question.</p>
<div class="eq"><span class="v">DDL</span> changes the schema <span class="op">&middot;</span> <span class="v">DML</span> changes the instance <span class="op">&middot;</span> <span class="v">DCL</span> changes who is allowed
<span class="eqn">and only DDL touches the data dictionary</span></div>
<p>One pair of commands sounds similar and is not, which is exactly why they get confused.
<b><code>DROP</code> removes the table itself</b> and it stops existing. <b><code>DELETE</code>
removes rows</b> and leaves an empty table standing. So <code>DROP</code> is DDL and
<code>DELETE</code> is DML.</p>
</section>

<section>
<h2>11. Inside the Engine</h2>
<p>You will meet these components again and again, so it is worth knowing roughly what each one
does. Every later chapter zooms in on one of them.</p>
<p>The <b>database engine</b> is what sits inside the DBMS and does the actual work. It has three
big parts.</p>
<dl class="tight">
  <dt>Storage manager</dt>
  <dd>Provides the interface between the <b>low-level data stored on disk</b> and the queries
  submitted to the system. Crucially, <b>it interacts with the file manager of the operating
  system</b>. Inside it sit the <b>buffer manager</b> (which disk blocks to keep in memory,
  Chapter 8), the authorization and integrity manager, and the file manager.</dd>
  <dt>Query processor</dt>
  <dd>Turns your SQL into an efficient plan and runs it. Contains the <b>parser and translator</b>,
  the <b>optimizer</b>, and the <b>evaluation engine</b>.</dd>
  <dt>Transaction manager</dt>
  <dd>Makes ACID true. Contains the <b>concurrency control manager</b>, which <b>maintains
  consistency when multiple transactions execute simultaneously</b>, and the recovery manager,
  which restores a consistent state after a crash.</dd>
</dl>
<p>Those precise phrasings matter. If a question asks which component <b>interacts with the file
manager of the operating system</b>, the answer is the <b>storage manager</b>. If it asks which
component <b>maintains consistency when multiple transactions execute simultaneously</b>, the answer
is the <b>concurrency control manager</b>, not the transaction manager in general.</p>

<h3>What happens to a query</h3>
<p>Follow one <code>SELECT</code> from your keyboard to the answer. This pipeline explains why the
next few chapters exist at all.</p>
${fig('f-eng',
`<div class="panel">
  <div class="phead"><span class="m" id="eng-hd"></span><span class="m" id="eng-n"></span></div>
  <svg class="d" viewBox="0 0 520 120" id="eng-svg"></svg>
  <div class="msg" id="eng-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 1.7, One query, from typed text to returned rows.',
`<button class="btn" id="eng-play">Send a query</button><button class="btn" id="eng-step">Step</button>
 <button class="btn" id="eng-back">Back</button><button class="btn" id="eng-reset">Reset</button>`,
'the optimizer is why you never have to say how to find the data')}
<p>The <b>optimizer</b> is the interesting stage. One query can be written as several different
relational algebra expressions, and each of those can be evaluated in several different orders. Each
option costs a different amount of time. The optimizer picks one, using <b>statistics about the
data</b> and also <b>statistics about queries run in the near past</b>, since a plan that worked
well recently is likely to work well again.</p>
<p>This is the deepest reason SQL looks the way it does. <b>You say what you want; the system
decides how to get it.</b> Chapter 4 is the algebra the optimizer works in, and Chapter 8 is the
cost model it uses.</p>
</section>

<section>
<h2>12. The People Around a Database</h2>
<p>Different people touch a database in different ways, and the categories have names.</p>
<dl class="tight">
  <dt>Naive users</dt>
  <dd>Interact only through an application someone else wrote. A bank clerk pressing buttons, or you
  using an ATM. They write no SQL and see only the view level.</dd>
  <dt>Application programmers</dt>
  <dd>Write the programs the naive users press buttons in. Chapter 7 is this job.</dd>
  <dt>Sophisticated users</dt>
  <dd>Write their own SQL directly, with no application in between. Analysts, for instance.</dd>
  <dt>Specialised users</dt>
  <dd>Build unusual systems on top of the database that do not fit the ordinary data-processing
  mould.</dd>
  <dt>Database administrator, the DBA</dt>
  <dd>Has access to <b>all three levels</b> of schema. Creates the schema, grants access, tunes
  performance, plans capacity, and handles backup and recovery.</dd>
</dl>
<p>The DBA is why "no dedicated administrator" was a reason <i>against</i> using a DBMS in section 5.
Databases are not static: a company starting with 100 employees may have 100,000 ten years later, so
the database keeps growing. Without somebody maintaining it as it scales, performance slowly
degrades. Under the DBA you typically find database engineers and application engineers.</p>
</section>

<section>
<h2>13. Where the Word &ldquo;Relational&rdquo; Comes From</h2>
<p>The word is not decoration. It is a precise mathematical term, and it explains what a table
<b>is</b>. Chapters 2 and 4 both lean on this.</p>
${teach('Set', 'a collection with no duplicates and no order', [
  'A collection of distinct things, where order does not matter and nothing appears twice.',
  'Because it is the building block of everything else here, including what a table turns out to be.',
  'The set of students in a room. Listing them in a different order describes the same set, and naming somebody twice adds nothing.',
  'The set of all student ids, or the set of all course codes.',
  'Written {a, b, c}. {a, b} and {b, a} are the same set.',
  'A well-defined collection of distinct objects.',
])}
${teach('Cartesian product', 'every possible pairing', [
  'Take two sets and form <b>every</b> pair with one element from each.',
  'Because it is the universe of all combinations that <i>could</i> exist, before you decide which ones are actually true.',
  'Three shirts and two pairs of trousers give six possible outfits, whether or not they look good together.',
  'Every student paired with every course, including all the pairs where the student never took that course.',
  'Written <i>A</i> &times; <i>B</i>. If A has 4 elements and B has 3, the product has <b>12</b>.',
  '<i>A</i> &times; <i>B</i> = { (<i>a</i>, <i>b</i>) : <i>a</i> &isin; A, <i>b</i> &isin; B }',
])}
${teach('Relation', 'the pairs that are actually true', [
  '<b>Any subset</b> of a Cartesian product: you keep some pairs and discard the rest.',
  'Because the interesting information is not "what could be paired" but "what actually is paired".',
  'Of the six possible outfits, the two you would really wear.',
  'A <code>takes</code> table holds exactly the (student, course) pairs that really happened. <b>That table is a relation.</b>',
  'This is why a table is called a relation, why a row is called a tuple, and why the whole thing is called the <b>relational</b> model.',
  'A relation R over sets A and B is a subset R &sube; <i>A</i> &times; <i>B</i>.',
])}
${fig('f-rel',
`<div class="panel">
  <div class="phead"><span class="m">student &times; course</span><span class="m" id="rel-cnt"></span></div>
  <table class="dt" id="rel-tbl"></table>
  <div class="msg" id="rel-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 1.8, Click cells to choose which pairs are true. Whatever you select is a relation, and so is a table.',
`<button class="btn" id="rel-clr">Select none</button><button class="btn" id="rel-all">Select all</button>
 <button class="btn" id="rel-some">A realistic subset</button>`,
'a table is a subset of the Cartesian product: the rows that happen to be true')}
<p>Keep this. In Chapter 3 the Cartesian product is what a join is built from, and in Chapter 4 it
becomes an operator in its own right.</p>
</section>

</article>` + cfoot('week-1');
}

function initWeek1() {
  /* ---- Fig 1.1 atomicity ---- */
  (function () {
    const STEPS = [
      ['read balance of A  (8000)', null],
      ['A = 8000 - 500', { A: 7500 }],
      ['write A to storage', null],
      ['read balance of B  (0)', null],
      ['B = 0 + 500', { B: 500 }],
      ['write B to storage', null],
    ];
    let mode = 'file', step = 0, crashed = -1;
    function draw() {
      let A = 8000, B = 0;
      const done = crashed >= 0 ? Math.min(step, crashed) : step;
      for (let i = 0; i < done; i++) {
        const d = STEPS[i][1];
        if (d) { if (d.A !== undefined) A = d.A; if (d.B !== undefined) B = d.B; }
      }
      const partial = crashed >= 3 && crashed < 6;
      if (mode === 'db' && crashed >= 0 && crashed < 6) { A = 8000; B = 0; }
      const tot = A + B;
      $('#atom-tbl').innerHTML = '<thead><tr><th>account</th><th>balance</th></tr></thead><tbody>' +
        `<tr><td>A</td><td>${A}</td></tr><tr><td>B</td><td>${B}</td></tr>` +
        `<tr class="${tot === 8000 ? '' : 'lo'}"><td>total</td><td><b>${tot}</b></td></tr></tbody>`;
      $('#atom-tot').innerHTML = 'total: <b style="color:' +
        (tot === 8000 ? 'var(--green)' : 'var(--terra)') + '">' + tot + '</b>' +
        (tot === 8000 ? '' : ', 500 destroyed');
      $('#atom-code').innerHTML = STEPS.map((s, i) => {
        const ran = i < done, isCrash = crashed === i;
        const next = crashed < 0 && i === done && done < 6;   /* about to run */
        return `<div style="padding:1px 5px;transition:background .18s ease;` +
          `${ran ? 'background:var(--indigo-tint)' : next ? 'background:var(--card)' : ''}` +
          `${isCrash ? 'color:var(--terra)' : ''}">${i + 1}. ${s[0]}` +
          (isCrash ? '   &larr; power lost here' : next ? '   &larr; next' : '') + '</div>' +
          (i === 2 ? '<div style="padding:1px 5px;color:var(--terra)">&nbsp; &larr; critical point</div>' : '');
      }).join('');
      $('#atom-mode-l').textContent = mode === 'file'
        ? 'file version (Python and CSV)' : 'database version (SQL transaction)';
      const m = $('#f-atom-msg');
      m.className = 'msg ' + (crashed < 0 ? (step >= 6 ? 'good' : '') : (tot === 8000 ? 'good' : 'bad'));
      $('#atom-note').innerHTML = crashed < 0
        ? (step >= 6 ? 'Transfer complete. When nothing goes wrong the two versions are identical, which is exactly why the difference is easy to miss.'
          : 'Press Step to run one line, or Crash here to cut the power at this point.')
        : mode === 'file'
          ? (partial ? '<b>The debit was already written to disk</b>, and the credit never happened. The file now says 7500 + 0 = 7500. That money is gone, and nothing will bring it back.'
            : 'The crash happened before the debit was written, so the file is untouched. Safe <b>by luck</b>, not by design. Crash at step 4 or 5 to see the real failure.')
          : 'The transaction never reached <code>COMMIT</code>, so the database <b>rolled it back</b>. Both balances are as they started. This is atomicity, and you wrote no code for it.';
      m.textContent = crashed < 0
        ? 'run it to the end and both versions agree'
        : mode === 'file'
          ? (partial ? 'The file version lost 500 rupees. Nothing detected it and nothing will fix it.'
            : 'Nothing was lost this time. Try crashing at step 4 or 5.')
          : 'The database version is back to its starting state, correct and complete.';
      $('#atom-step').disabled = step >= 6 || crashed >= 0;
      $('#atom-crash').disabled = step >= 6 || crashed >= 0 || step === 0;
    }
    /* Letting it run is the point: the power has to be cut while the transfer
       is actually in flight, which a stepped table never quite conveys. */
    const tk = ticker($('#f-atom'), () => {
      if (step < 6) step++;
      if (step >= 6) tk.pause();
      draw(); label();
    }, 750);
    function label() {
      $('#atom-play').textContent = tk.playing ? 'Pause' : (step >= 6 || crashed >= 0 ? 'Run again' : 'Run it');
      $('#atom-crash').disabled = crashed >= 0 || step === 0 || step >= 6;
    }
    $('#atom-play').onclick = () => {
      if (!tk.playing && (step >= 6 || crashed >= 0)) { step = 0; crashed = -1; }
      tk.toggle(); label(); draw();
    };
    setPills($('#f-atom'), 'atom', v => { mode = v; draw(); label(); });
    $('#atom-step').onclick = () => { tk.pause(); if (step < 6) step++; draw(); label(); };
    $('#atom-crash').onclick = () => { tk.pause(); crashed = step; draw(); label(); };
    $('#atom-reset').onclick = () => { tk.pause(); step = 0; crashed = -1; draw(); label(); };
    draw();
    label();
  })();

  /* ---- Fig 1.2 ACID ---- */
  (function () {
    const D = {
      a: ['Atomicity', 'all or nothing',
        [['what it promises', 'the whole transaction happens, or none of it does'],
          ['without it', 'a crash between the debit and the credit destroys money'],
          ['who enforces it', 'the recovery manager, by rolling back'],
          ['the everyday sign', 'a failed payment refunded in a few working days']],
        'The debit and the credit are one unit. If the second half cannot happen, the first half is undone.'],
      c: ['Consistency', 'the declared rules always hold',
        [['what it promises', 'every committed state satisfies every declared rule'],
          ['without it', 'a balance goes negative, or a foreign key points at nothing'],
          ['who enforces it', 'the integrity manager, checking constraints'],
          ['who writes the rules', '<b>you do.</b> The database enforces, it does not invent']],
        'You declare that a balance may not go negative. Any transaction that would break it is refused.'],
      i: ['Isolation', 'as if you were alone',
        [['what it promises', 'concurrent transactions never see each other half-done'],
          ['without it', 'two simultaneous withdrawals both read the old balance'],
          ['who enforces it', '<b>the concurrency control manager</b>'],
          ['the formal name', 'serializability, covered in Week 10']],
        'You and a parent debit the same account at the same instant, and the final balance is still right.'],
      d: ['Durability', 'once committed, it stays',
        [['what it promises', 'a committed change survives a crash one second later'],
          ['without it', '"saved" would mean nothing at all'],
          ['who enforces it', 'the recovery manager, via logging'],
          ['why disks matter', 'memory empties on power loss, so the change must reach disk']],
        'After <code>COMMIT</code> returns, the change is permanent unless you deliberately undo it.'],
    };
    function draw(k) {
      const [name, tag, rows, note] = D[k];
      $('#ac-tbl').innerHTML = '<thead><tr><th>question</th><th>answer</th></tr></thead><tbody>' +
        rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      $('#ac-name').innerHTML = '<b>' + name + '</b>';
      $('#ac-one').textContent = tag;
      $('#ac-note').innerHTML = note;
    }
    setPills($('#f-acid'), 'ac', draw);
    draw('a');
  })();

  /* ---- Fig 1.3 scan vs index ---- */
  (function () {
    function draw() {
      const k = +$('#sc-s').value;
      $('#sc-s-v').textContent = k;
      const n = k * 1000;
      const scan = n / 2;
      const idx = Math.ceil(Math.log2(n)) + 1;
      $('#sc-tbl').innerHTML = '<thead><tr><th>method</th><th>records examined</th><th>roughly</th></tr></thead><tbody>' +
        `<tr><td>scan a file, front to back</td><td>${Math.round(scan).toLocaleString()}</td>` +
        `<td>${(scan / 1000).toFixed(1)} thousand</td></tr>` +
        `<tr class="hi"><td>indexed lookup in a DBMS</td><td>${idx}</td><td>${idx} steps</td></tr>` +
        `<tr><td>ratio</td><td colspan="2"><b>${Math.round(scan / idx).toLocaleString()} to 1</b></td></tr></tbody>`;
      $('#sc-n').textContent = n.toLocaleString() + ' records';
      $('#sc-note').innerHTML = 'A scan has to look at about <b>half</b> the records on average, so ' +
        'doubling the data doubles the work. An indexed lookup adds roughly <b>one</b> step when the ' +
        'data doubles, because it halves the search space each time. Chapter 8 explains why, and ' +
        'Week 9 builds the index.';
      $('#f-cost-msg').textContent = k <= 5
        ? 'At small sizes the difference hardly matters, which is exactly why a file is fine for a small job.'
        : 'a scan grows with the data; an indexed lookup barely does';
    }
    $('#sc-s').oninput = draw;
    draw();
  })();

  /* ---- Fig 1.4 three levels ---- */
  (function () {
    const L = [['v', 'view level', 'external schema', 22, 'what one user may see'],
      ['l', 'logical level', 'conceptual schema', 62, 'what data exists and how it relates'],
      ['p', 'physical level', 'internal schema', 102, 'how the bytes sit on the disk']];
    const N = {
      v: '<b>View level.</b> A chosen slice of the database for one group of users, built with <code>CREATE VIEW</code>. It hides the most, so it is the <b>highest</b> level of abstraction. A database has many of these, one per group.',
      l: '<b>Logical level.</b> The tables, their columns and types, their keys and constraints, and the relationships between tables. Deciding which attribute goes in which table, and which is the primary key, happens here. A database has exactly <b>one</b> logical schema.',
      p: '<b>Physical level.</b> Files, blocks and data structures on disk. Whether an index is a B tree or a B+ tree is decided here. It hides nothing, so it is the <b>lowest</b> level of abstraction. A programmer working on internal storage structures is working at this level.',
    };
    const WHO = { v: 'a bank clerk, an ATM user', l: 'a database designer', p: 'a storage engineer' };
    function draw(k) {
      let s = '';
      L.forEach(([id, name, alt, y, sub]) => {
        const on = id === k;
        s += DG.box(DG.PAD, y, 300, 32, name, sub, {
          fill: on ? 'var(--indigo-tint)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', r: 4,
        });
        s += DG.txt(330, y + 16, alt, { cls: 'm mu' });
        if (on) s += DG.txt(330, y + 30, WHO[id], { cls: 'm', fill: 'var(--indigo)', size: 10.5 });
      });
      s += DG.txt(DG.PAD, 14, 'most hidden, highest abstraction', { cls: 'm mu' });
      s += DG.txt(DG.PAD, 148, 'nothing hidden, lowest abstraction', { cls: 'm mu' });
      $('#lv-svg').innerHTML = s;
      $('#lv-note').innerHTML = N[k] ||
        'Pick a level. Reading top to bottom is reading from <b>most</b> abstract to <b>least</b>, because abstraction measures how much is hidden.';
    }
    setPills($('#f-lv'), 'lv', draw);
    draw(null);
  })();

  /* ---- Fig 1.5 schema constraints ---- */
  (function () {
    const BASE = [['101', 'Rahul', '9.0'], ['102', 'Priya', '8.4'], ['103', 'Arjun', '7.1']];
    const TRY = {
      ok: [['104', 'Nita', '8.2'], true, 'Accepted. The id is new, the CGPA is in range, and nothing is missing, so the row joins the instance. <b>The schema did not change at all</b>, only the contents did.'],
      dup: [['101', 'Zoya', '7.0'], false, 'Rejected. <code>id</code> is the <b>primary key</b>, and 101 already exists. Two rows may not share a primary key value, so the insert is refused.'],
      bad: [['105', 'Amit', '47'], false, 'Rejected. A <code>CHECK</code> constraint says the CGPA must lie between 0 and 10, and 47 does not. The value is legal as a number and illegal as a CGPA, which is the difference between a <b>type</b> and a <b>constraint</b>.'],
      null: [[null, 'Ravi', '6.5'], false, 'Rejected. A primary key may never be <b>NULL</b>, because a row with no identifier cannot be told apart from any other.'],
    };
    function draw(k) {
      const t = k ? TRY[k] : null;
      const show = t && t[1] ? BASE.concat([t[0]]) : BASE;
      $('#sch-tbl').innerHTML = '<thead><tr><th>id</th><th>name</th><th>cgpa</th></tr></thead><tbody>' +
        show.map((r, i) => `<tr class="${t && t[1] && i === show.length - 1 ? 'hi' : ''}">` +
          r.map(v => v === null ? '<td class="nul">NULL</td>' : `<td>${v}</td>`).join('') +
          '</tr>').join('') +
        (t && !t[1] ? '<tr class="lo">' + t[0].map(v => v === null
          ? '<td class="nul">NULL</td>' : `<td>${v}</td>`).join('') + '</tr>' : '') +
        '</tbody>';
      $('#sch-cnt').textContent = (t && t[1] ? show.length : BASE.length) + ' rows in the instance';
      $('#sch-note').innerHTML = t ? t[2]
        : 'Three rules are declared on this table: <code>id</code> is the primary key, so it must be unique and not null, and <code>cgpa</code> must lie between 0 and 10. Try each insert.';
      const m = $('#f-sch-msg');
      m.className = 'msg ' + (t ? (t[1] ? 'good' : 'bad') : '');
      m.textContent = t && !t[1]
        ? 'The row is not stored. No application code checked this: the engine did, and it would refuse any program equally.'
        : 'the rules live in the database, so every program obeys them';
    }
    setPills($('#f-sch'), 'sch', draw);
    draw(null);
  })();

  /* ---- Fig 1.6 data independence ---- */
  (function () {
    const L = [['v', 'view level', 22], ['l', 'logical level', 58], ['p', 'physical level', 94]];
    const S = {
      p: ['a change at the physical level', 'physical data independence', ['p'], [],
        'Example: a B+ tree node is changed from holding <b>3 records</b> to holding <b>5</b>. The whole tree and the disk layout are rewritten. <b>Neither the logical nor the view level may notice.</b> The clerk sees the same table on screen; only the speed changed, which is exactly why the change was made.'],
      l: ['a change at the logical level', 'logical data independence', ['l'], ['p'],
        'Example: <code>name</code> is split into <code>first_name</code> and <code>last_name</code>. The <b>view level must be unaffected</b>, since a view can join them back together. The <b>physical level will be affected</b>, and that is expected: a new column is new data, so storage must be rearranged.'],
      v: ['a change at the view level', 'nothing is promised upward', ['v'], [],
        'A view sits at the top, so there is no level above it to protect. Changing a view affects only the users of that view. There is no third kind of data independence, because independence only ever protects <b>upwards</b>.'],
    };
    function draw(k) {
      const [hd, verd, changed, mayAffect, note] = S[k];
      const idx = L.findIndex(x => x[0] === k);
      let s = '';
      L.forEach(([id, name, y], i) => {
        const isChanged = changed.includes(id);
        const isMay = mayAffect.includes(id);
        const isProtected = i < idx;
        s += DG.box(DG.PAD, y, 250, 28, name, null, {
          fill: isChanged ? 'var(--terra-tint)' : isProtected ? 'var(--green-tint)' : '#fff',
          stroke: isChanged ? 'var(--terra)' : isProtected ? 'var(--green)' : '#e5e5e3', r: 4,
        });
        const lab = isChanged ? 'changed here'
          : isProtected ? 'must NOT be affected'
            : isMay ? 'may be affected, and that is fine' : '';
        if (lab) s += DG.txt(276, y + 18, lab, { cls: 'm mu' });
      });
      s += DG.txt(DG.PAD, 128, 'protection travels upwards only', { cls: 'm mu' });
      $('#ind-svg').innerHTML = s;
      $('#ind-hd').textContent = hd;
      $('#ind-verd').textContent = verd;
      $('#ind-note').innerHTML = note;
    }
    setPills($('#f-ind'), 'ind', draw);
    draw('p');
  })();

  /* ---- Fig 1.7 query pipeline ---- */
  (function () {
    const P = [
      ['you type a query', 'SELECT name FROM student WHERE id = 101',
        'Declarative: it says <b>what</b> you want and nothing about how to get it.'],
      ['parser and translator', 'check the syntax, resolve the names',
        'The text is checked for syntax, the table and column names are looked up in the <b>data dictionary</b>, and the query becomes a <b>relational algebra expression</b>.'],
      ['optimizer', 'compare the possible plans',
        'One query has several equivalent algebra expressions, and each can be evaluated in several orders. The optimizer costs them using <b>statistics about the data</b> and <b>statistics about queries run recently</b>.'],
      ['execution plan', 'the chosen route',
        'One plan is selected: which index to use, which table to read first, which join method. This is the stage that Chapter 4 and Chapter 8 exist to support.'],
      ['evaluation engine', 'actually fetch the rows',
        'The plan is carried out against the data on disk, going through the <b>storage manager</b>, which asks the operating system&rsquo;s file manager for the blocks.'],
      ['result returned', 'rows on your screen',
        'You get a table back. You never said how to find it, and if the storage layout changes tomorrow you still will not have to.'],
    ];
    const BW = 78, GAP = 10;
    const bx = i => DG.PAD + i * (BW + GAP);        /* left edge of box i */
    const mid = i => bx(i) + BW / 2;
    let k = 0, markX = mid(0);

    function draw() {
      let s = '';
      P.forEach((p, i) => {
        const on = i === k, done = i < k;
        s += DG.box(bx(i), 40, BW, 34, String(i + 1), null, {
          fill: on ? 'var(--indigo-tint)' : done ? 'var(--card)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', r: 4, cls: 'm',
        });
        if (i < P.length - 1) {
          s += DG.arrow(bx(i) + BW + 1, 57, bx(i) + BW + GAP - 1, 57, { stroke: '#c9c9c4' });
        }
      });
      /* the query itself, travelling. On the last stage it is the answer
         coming back, so it runs the other way. */
      s += `<circle id="eng-mark" cx="${markX.toFixed(1)}" cy="30" r="4.5" ` +
        `fill="${k >= P.length - 1 ? 'var(--green)' : 'var(--indigo)'}"/>`;
      s += `<text id="eng-marklb" class="m mu" x="${markX.toFixed(1)}" y="20" text-anchor="middle">` +
        (k >= P.length - 1 ? 'rows' : 'query') + '</text>';
      s += DG.txt(DG.PAD, 94, P[k][1], { cls: 'm mu' });
      s += DG.txt(DG.PAD, 112, 'statistics about the data and about recent queries feed stages 3 and 4',
        { cls: 'm mu' });
      $('#eng-svg').innerHTML = s;
      $('#eng-hd').textContent = 'stage ' + (k + 1) + ' of 6';
      $('#eng-n').textContent = P[k][0];
      $('#eng-note').innerHTML = P[k][2];
      $('#eng-step').disabled = k >= P.length - 1;
      $('#eng-back').disabled = k <= 0;
    }

    /* Only the marker moves per frame, so the drawing is not rebuilt 60 times
       a second. Target is the current stage, or back to the start once the
       answer is on its way out. */
    raf($('#f-eng'), dt => {
      const want = k >= P.length - 1 ? mid(0) : mid(k);
      if (Math.abs(markX - want) < 0.3) { markX = want; return; }
      markX = lerp(markX, want, Math.min(1, dt * 4));
      const c = $('#eng-mark'), l = $('#eng-marklb');
      if (c) c.setAttribute('cx', markX.toFixed(1));
      if (l) l.setAttribute('x', markX.toFixed(1));
    });

    const tk = ticker($('#f-eng'), () => {
      k++;
      if (k >= P.length - 1) { k = P.length - 1; tk.pause(); }
      draw(); label();
    }, 1100);
    function label() {
      $('#eng-play').textContent = tk.playing ? 'Pause'
        : k >= P.length - 1 ? 'Send another' : 'Send a query';
    }
    $('#eng-play').onclick = () => {
      if (!tk.playing && k >= P.length - 1) { k = 0; markX = mid(0); }
      tk.toggle(); label(); draw();
    };
    $('#eng-step').onclick = () => { tk.pause(); if (k < P.length - 1) k++; draw(); label(); };
    $('#eng-back').onclick = () => { tk.pause(); if (k > 0) k--; draw(); label(); };
    $('#eng-reset').onclick = () => { tk.pause(); k = 0; markX = mid(0); draw(); label(); };
    draw();
    label();
  })();

  /* ---- Fig 1.8 relation as a subset ---- */
  (function () {
    const S = ['Asha', 'Ravi', 'Meera'];
    const C = ['DBMS', 'PDSA', 'ML', 'Stats'];
    const REAL = ['0|0', '0|1', '1|0', '1|3', '2|1', '2|2'];
    let sel = new Set(REAL);
    function draw() {
      $('#rel-tbl').innerHTML = '<thead><tr><th></th>' + C.map(c => `<th>${c}</th>`).join('') +
        '</tr></thead><tbody>' + S.map((s, i) => `<tr><td><b>${s}</b></td>` +
          C.map((c, j) => {
            const on = sel.has(i + '|' + j);
            return `<td class="cell ${on ? 'hl' : ''}" data-k="${i}|${j}" ` +
              `style="cursor:pointer;text-align:center">${on ? 'yes' : ''}</td>`;
          }).join('') + '</tr>').join('') + '</tbody>';
      $$('#rel-tbl .cell').forEach(td => td.onclick = () => {
        const kk = td.dataset.k;
        sel.has(kk) ? sel.delete(kk) : sel.add(kk);
        draw();
      });
      const tot = S.length * C.length;
      $('#rel-cnt').textContent = sel.size + ' of ' + tot + ' possible pairs selected';
      $('#rel-note').innerHTML = sel.size === tot
        ? 'Every pair kept. That is the <b>full Cartesian product</b>, and it is not a useful table: it claims every student took every course.'
        : sel.size === 0
          ? 'The empty set is also a perfectly legal relation. It just says nothing is true yet.'
          : 'A relation is a <b>subset</b> of the product, which is precisely what a table is: the rows that happen to be true. ' +
            S.length + ' students &times; ' + C.length + ' courses = ' + tot +
            ' possible pairs, of which ' + sel.size + ' are recorded.';
    }
    $('#rel-clr').onclick = () => { sel = new Set(); draw(); };
    $('#rel-all').onclick = () => {
      sel = new Set();
      S.forEach((_, i) => C.forEach((__, j) => sel.add(i + '|' + j)));
      draw();
    };
    $('#rel-some').onclick = () => { sel = new Set(REAL); draw(); };
    draw();
  })();
}
</script>

<script>
function renderWeek2() {
  return chead('week-2') + `<article>

<section>
<h2>1. What a Table Really Is</h2>
<p>Chapter 1 ended by showing that a table is a <b>relation</b>: a subset of a Cartesian product.
This chapter takes that from mathematics into SQL, and every word below has a precise meaning that
gets used for the rest of the course.</p>
${teach('Relation', 'the formal word for a table', [
  'A table: a set of rows, all having the same named columns.',
  'Because "table" is the everyday word and "relation" is the exact one, and the exam uses the exact one.',
  'A school register: ruled columns, one line per student, every line about the same kind of thing.',
  '<code>student(id, name, dept_name, tot_cred)</code>.',
  'It is a <b>set</b> of rows, which is why duplicates and ordering carry no meaning.',
  'A relation over attributes A&#8321;, &hellip;, A&#8345; is a subset of dom(A&#8321;) &times; &hellip; &times; dom(A&#8345;).',
])}
${teach('Attribute', 'the formal word for a column', [
  'One named column of a table, holding one kind of fact about every row.',
  'Because a row is not one blob of text: it is several separate facts, and each needs its own labelled slot so it can be searched and constrained separately.',
  'The "phone number" column on a form. Every form has that box, and every box holds the same kind of thing.',
  '<code>name</code> is an attribute of <code>student</code>. Every student row has a name.',
  'Each attribute has a <b>domain</b>: the set of values it is allowed to hold. That is section 2.',
  'A named column of a relation, with an associated domain.',
])}
${teach('Tuple', 'the formal word for a row', [
  'One complete row: one full record.',
  'Because the row is the unit you insert, delete and retrieve, so it needs its own name.',
  'One line in the register, describing one student completely.',
  '<code>(101, Rahul, Comp. Sci., 65)</code> is one tuple.',
  '<b>Tuples have no order.</b> The database may return them in any sequence unless you ask for sorting, because a relation is a set.',
  'An element of a relation: one assignment of a value to each attribute.',
])}
<p>Two counting words follow immediately, and they are easy to swap by accident.</p>
<div class="eq"><span class="v">degree</span> = number of attributes (columns) <span class="op">&middot;</span> <span class="v">cardinality</span> = number of tuples (rows)</div>
<p>So a table with 4 columns and 12 rows has degree 4 and cardinality 12. Remember which is which by
the everyday meaning of cardinality: it is the <i>size</i> of a set, and the relation is a set of
<i>rows</i>.</p>
${fig('f-anat',
`<div class="panel">
  <div class="phead"><span class="m">student</span><span class="m" id="an-cnt"></span></div>
  <table class="dt" id="an-tbl"></table>
  <div class="msg" id="an-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.1, The vocabulary, on one table. Pick a term to see what it picks out.',
`<span class="lab">term:</span>${pills('an', [['rel', 'relation'], ['att', 'attribute'], ['tup', 'tuple'], ['val', 'value'], ['deg', 'degree'], ['card', 'cardinality']], -1)}`,
'a relation is a set of tuples, so order and duplicates carry no meaning')}
<p>One distinction worth stating plainly, because it is asked. In the column <code>dept_name</code>,
the <b>attribute</b> is <code>dept_name</code>. <b>Comp. Sci.</b> and <b>Biology</b> are
<b>values</b> of that attribute. They are not attributes themselves.</p>
</section>

<section>
<h2>2. Domain Types</h2>
${teach('Domain', 'what a column is allowed to hold', [
  'The set of values a particular attribute may take: its type, plus any further restriction.',
  'Because a column that could hold anything can be trusted for nothing. Declaring the domain lets the database reject nonsense before it is ever stored.',
  'The "date of birth" box on a form. Writing "banana" there is not a mistake to fix later; it is not a date at all.',
  '<code>cgpa NUMERIC(3,2)</code> means a number with three digits, two of them after the decimal point.',
  'Every column must be given a domain type at <code>CREATE TABLE</code> time. It is the SQL equivalent of a Python type.',
  'The set of permitted values for an attribute.',
])}
<div class="tw"><table class="pt">
<thead><tr><th>Type</th><th>Holds</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>INT</code>, <code>SMALLINT</code></td><td>whole numbers</td><td><code>SMALLINT</code> for small ranges, such as an age</td></tr>
<tr><td><code>NUMERIC(p, d)</code></td><td>a decimal number</td><td><i>p</i> digits in total, <i>d</i> of them after the point. <code>NUMERIC(3,2)</code> holds 9.99 but not 99.9</td></tr>
<tr><td><code>REAL</code>, <code>FLOAT</code></td><td>approximate decimals</td><td>Faster, and not exact. Never use for money</td></tr>
<tr><td><code>CHAR(n)</code></td><td><b>exactly</b> <i>n</i> characters</td><td>Shorter values are <b>padded with spaces</b> to length <i>n</i></td></tr>
<tr><td><code>VARCHAR(n)</code></td><td><b>up to</b> <i>n</i> characters</td><td>Stores only what you gave it. <i>n</i> is a ceiling, not a promise</td></tr>
<tr><td><code>DATE</code>, <code>TIME</code>, <code>TIMESTAMP</code></td><td>points in time</td><td>Real date arithmetic, unlike a string</td></tr>
</tbody></table></div>
<p>The <code>CHAR</code> and <code>VARCHAR</code> distinction is the one that matters in practice,
and the lecture picks it carefully.</p>
<dl class="tight">
  <dt>Use <code>CHAR(n)</code> when the length is genuinely <b>fixed</b></dt>
  <dd>A roll number is always ten characters. A grade is always one. Storing "A" in
  <code>CHAR(1)</code> is exact and wastes nothing.</dd>
  <dt>Use <code>VARCHAR(n)</code> when the length <b>varies</b></dt>
  <dd>Names are short or long. <code>VARCHAR(30)</code> says "at most thirty", and a four-character
  name occupies four characters, not thirty.</dd>
</dl>
${fig('f-dom',
`<div class="panel">
  <div class="phead"><span class="m" id="dm-hd"></span><span class="m" id="dm-use"></span></div>
  <table class="dt" id="dm-tbl"></table>
  <div class="msg" id="dm-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.2, The same four names in CHAR(10) and VARCHAR(10). Watch where the padding goes and what happens past the limit.',
`${slider('dm-n', 3, 14, 1, 10, 'declared length n')}`,
'CHAR pads to exactly n; VARCHAR stores only what you gave it')}
</section>

<section>
<h2>3. Keys: Telling One Row From Another</h2>
<p>Here is the problem keys exist to solve. Two people share a house, so they might share a chess
rating, an age, even a WhatsApp number, and they might have chosen the same username. If nothing in
the table is guaranteed different, then <b>two rows could be completely identical</b>, and no query
could ever separate them. A table like that cannot be trusted.</p>
<p>Three key words, and they nest inside each other. Getting the nesting right answers most of the
questions asked about them.</p>
${teach('Superkey', 'enough to identify a row', [
  'Any set of attributes whose values are guaranteed different for every row.',
  'Because the very first question is simply "can I tell these rows apart at all?", before worrying about doing it efficiently.',
  'Identifying a person by <i>full name plus date of birth plus address</i>. It certainly works. It is also more than you needed.',
  'In <code>user(user_id, username, age, rating)</code>, the pair {user_id, username} is a superkey, because user_id alone is already unique.',
  'A superkey <b>may contain extra attributes that do no work</b>. Adding more columns to a superkey always gives another superkey.',
  'A set K of attributes such that no two distinct tuples agree on all of K.',
])}
${teach('Candidate key', 'a superkey with nothing spare', [
  'A superkey that is <b>minimal</b>: remove any attribute from it and it stops identifying rows.',
  'Because you want the smallest honest identifier, and there may be several equally good ones.',
  'Identifying a person by passport number, or by Aadhaar number. Either works alone, and neither has anything spare.',
  'In the user table, {user_id} is a candidate key. {user_id, username} is not, because username can be dropped.',
  '<b>"Minimal" means the <i>set</i> is minimal, not that the values are short.</b> It has nothing to do with how many characters a user_id has.',
  'A superkey no proper subset of which is a superkey.',
])}
${teach('Primary key', 'the one you chose', [
  'The one candidate key the designer picks as <i>the</i> official identifier for the table.',
  'Because the database needs a single agreed answer to "which row is this?", for indexing and for other tables to point at.',
  'Picking the passport number, rather than the driving licence number, as the official id, even though both would work.',
  '<code>PRIMARY KEY (user_id)</code> in the table definition.',
  'It is <b>automatically UNIQUE and NOT NULL</b>. You never have to declare those separately, and a NULL primary key is impossible because a row with no identifier cannot be told apart from any other.',
  'A designated candidate key.',
])}
<div class="eq">every primary key is a candidate key <span class="op">&middot;</span> every candidate key is a superkey
<span class="eqn">and none of those arrows runs backwards</span></div>
<p>That single line settles a whole family of true-or-false questions:</p>
<dl class="tight">
  <dt>"All candidate keys are superkeys."</dt>
  <dd><b>True.</b> A candidate key is a superkey that happens to be minimal.</dd>
  <dt>"All superkeys are candidate keys."</dt>
  <dd><b>False.</b> A superkey with a spare attribute is not minimal.</dd>
  <dt>"All superkeys are primary keys."</dt>
  <dd><b>False.</b> Only one candidate key is chosen as primary.</dd>
  <dt>"A foreign key can be a primary key."</dt>
  <dd><b>True.</b> Nothing stops a column being both. It happens whenever a table&rsquo;s identifier
  is borrowed from another table, which is exactly what a weak entity does in Chapter 4.</dd>
</dl>
<p>And choosing the primary key is a <b>design decision about the real world</b>, not a rule. Name
is a bad choice, because two students really can share a name and the second insert would be
refused. Roll number is a good choice, because the institution guarantees it is unique.</p>
${fig('f-key',
`<div class="panel">
  <div class="phead"><span class="m" id="ky-hd"></span><span class="m" id="ky-verd"></span></div>
  <table class="dt" id="ky-tbl"></table>
  <div class="msg" id="ky-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.3, Testing candidate key sets against real data. A repeated combination is a counterexample.',
`<span class="lab">try as a key:</span>${pills('ky', [['id', '{user_id}'], ['un', '{username}'], ['iu', '{user_id, username}'], ['ua', '{username, age}'], ['ar', '{age, rating}']], 0)}`,
'a superkey identifies; a candidate key identifies with nothing spare')}

<h3>Composite keys</h3>
<p>A key need not be one column. <code>PRIMARY KEY (course, term, level, name)</code> declares that
those four <b>together</b> must be unique, and the database checks the whole combination as one
value.</p>
<p>So the same course, term and level may appear many times, and the same name may appear many
times, as long as no two rows repeat all four at once. That is why an enrolment table is usually
keyed by (student, course) rather than by either alone.</p>
</section>

<section>
<h2>4. How Many Superkeys?</h2>
<p>This gets asked as a number, so it is worth being able to compute rather than count by hand.</p>
<p>The reasoning is short. A superkey is <b>any set that contains a candidate key</b>. So fix the
candidate key as present, and every <i>other</i> attribute is independently free to be in or out.</p>
<div class="eq">with <span class="v">n</span> attributes and one candidate key of size <span class="v">k</span>: &nbsp; <span class="v">2<sup>n&minus;k</sup></span> superkeys
<span class="eqn">the n &minus; k remaining attributes are each free to be present or absent</span></div>
<p>The commonest case is a single-attribute primary key, where <i>k</i> = 1, giving
<b>2<sup>n&minus;1</sup></b>.</p>
${wex('Worked: student(studID, Sname, Age, Sex) with studID as the primary key',
'<p style="margin:0 0 8px">Here <i>n</i> = 4 and <i>k</i> = 1. Every superkey must contain ' +
'<code>studID</code>; the other three attributes are each free.</p>' +
'<div class="eq" style="margin:0 0 8px">2<sup>4&minus;1</sup> = 2<sup>3</sup> = <b>8</b></div>' +
'<p style="margin:0">Listing them confirms it: {studID}, {studID,Sname}, {studID,Age}, ' +
'{studID,Sex}, {studID,Sname,Age}, {studID,Sname,Sex}, {studID,Age,Sex}, and all four together.</p>')}
${fig('f-cnt',
`<div class="panel">
  <div class="phead"><span class="m" id="ct-hd"></span><span class="m" id="ct-tot"></span></div>
  <table class="dt" id="ct-tbl"></table>
  <div class="msg" id="ct-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.4, Every subset of a four-attribute relation, sorted into superkeys and not. The arithmetic and the enumeration agree.',
`<span class="lab">candidate keys:</span>${pills('ct', [['a', '{A} only'], ['b', '{A,B} only'], ['c', '{A} and {B}'], ['d', '{A,B} and {C,D}']], 0)}`,
'a superkey is any set containing a candidate key')}
<p>With <b>more than one</b> candidate key you cannot simply add the counts, because sets containing
<i>both</i> keys would be counted twice. Add the individual counts, then subtract the overlap. That
is inclusion and exclusion, and the figure above checks it against a full enumeration.</p>
</section>

<section>
<h2>5. Foreign Keys and Referential Integrity</h2>
<p>Keys identify rows within one table. A <b>foreign key</b> is how one table points at another,
which is what makes a set of tables into a database rather than a pile of spreadsheets.</p>
${teach('Foreign key', 'a pointer to another table', [
  'A column (or set of columns) in one table whose values must appear as a key in another table.',
  'Because facts are deliberately split across tables to avoid repeating them, and something has to link the pieces back together.',
  'A library slip saying "borrowed by member 4021". The slip does not repeat the member&rsquo;s name, address and phone number: it just names them.',
  'In <code>takes(id, course_id, grade)</code>, <code>id</code> is a foreign key referencing <code>student(id)</code>.',
  'The table pointed <i>at</i> is the <b>parent</b>; the table doing the pointing is the <b>child</b>.',
  'A set of attributes FK in R&#8321; such that FK values in R&#8321; must appear as key values in R&#8322;.',
])}
<pre><code><span class="kw">CREATE TABLE</span> takes (
    id        <span class="kw">INT</span>,
    course_id <span class="kw">VARCHAR</span>(8),
    grade     <span class="kw">CHAR</span>(2),
    <span class="kw">PRIMARY KEY</span> (id, course_id),
    <span class="kw">FOREIGN KEY</span> (id)        <span class="kw">REFERENCES</span> student(id),
    <span class="kw">FOREIGN KEY</span> (course_id) <span class="kw">REFERENCES</span> course(course_id)
);</code></pre>
${teach('Referential integrity', 'no pointer to nowhere', [
  'The rule that a foreign key value must actually exist in the parent table.',
  'Because a loan belonging to member 4021 is meaningless if no member 4021 exists. The database would be asserting something false.',
  'A library slip naming a member who was never registered. The slip is worse than useless: it is a lie.',
  'Inserting a <code>takes</code> row for student 999 is <b>refused</b> if there is no student 999.',
  'It also works in the other direction: <b>deleting a parent row that is still referenced is refused</b>, and dropping a referenced table is refused too.',
  'Every foreign key value in the child either appears in the parent, or is NULL.',
])}
<p>Finding the foreign keys in an unfamiliar schema is a standard exercise, and the method is
mechanical: <b>look for a column that is the primary key of one table appearing as an ordinary
column of another</b>.</p>
${wex('Worked: identify the foreign keys',
mini(['relation', 'attributes  (primary key underlined in the question)'],
  [['employees', 'employee_num, employee_name, contact_num, salary'],
   ['taskAssignment', 'employee_num, task_num, task_duration'],
   ['tasks', 'task_num, location']]) +
'<p style="margin:8px 0 0"><b>Two</b> foreign keys, both in <code>taskAssignment</code>: ' +
'<code>employee_num</code> references <code>employees</code>, and <code>task_num</code> references ' +
'<code>tasks</code>. Neither <code>employees</code> nor <code>tasks</code> points at anything, so ' +
'they contribute none. Note that a table can hold several foreign keys at once, and that ' +
'<code>taskAssignment</code> is the classic shape of a many-to-many link table from Chapter 4.</p>')}
${fig('f-fk',
`<div class="panel">
  <div class="phead"><span class="m" id="fk-hd"></span><span class="m" id="fk-verd"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">student  (parent)</div><table class="dt" id="fk-p"></table></div>
    <div><div class="tname">takes  (child)</div><table class="dt" id="fk-c"></table></div>
  </div>
  <div class="msg" id="fk-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.5, Four operations against a foreign key. Two are allowed and two are refused.',
`<span class="lab">try:</span>${pills('fk', [['none', 'as stored'], ['ok', 'insert takes(102, DBMS)'], ['bad', 'insert takes(999, DBMS)'], ['del', 'delete student 101'], ['drop', 'drop table student']], 0)}`,
'a foreign key value must exist in the parent, and a referenced parent row cannot vanish')}

<h3>What to do when the parent is deleted</h3>
<p>Refusing the delete is only one option. You can tell the database in advance what should happen
instead, and the choice is part of the foreign key declaration.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Clause</th><th>When the parent row is deleted</th></tr></thead>
<tbody>
<tr><td><b>(nothing)</b></td><td>The delete is <b>refused</b>. This is the default</td></tr>
<tr><td><code>ON DELETE CASCADE</code></td><td>The matching child rows are <b>deleted too</b>, automatically</td></tr>
<tr><td><code>ON DELETE SET NULL</code></td><td>The child rows survive with the foreign key set to NULL</td></tr>
</tbody></table></div>
<p><code>CASCADE</code> is worth studying carefully, because <b>it can chain</b>, and that surprises
people. If deleting a parent removes a child, and that child was itself the parent of something else,
the deletion carries on down.</p>
${wex('Worked: a table that references itself',
'<pre style="margin:0 0 8px"><code><span class="kw">CREATE TABLE</span> multiple (\n' +
'    first  <span class="kw">INT</span>,\n    second <span class="kw">INT</span>,\n' +
'    <span class="kw">PRIMARY KEY</span> (first),\n' +
'    <span class="kw">FOREIGN KEY</span> (second) <span class="kw">REFERENCES</span> multiple\n' +
'        <span class="kw">ON DELETE CASCADE</span>\n);</code></pre>' +
'<p style="margin:0 0 8px">Each row (a, b) records that <b>a is a multiple of b</b>. Now delete the ' +
'row (a, b). What else goes?</p>' +
'<p style="margin:0 0 8px">Follow the chain. Any row of the form <b>(e, a)</b> points at a through ' +
'its foreign key, so it is deleted. That deletion then removes any row <b>(d, e)</b>, and that ' +
'removes any row <b>(c, d)</b>, and so on.</p>' +
'<p style="margin:0">Now read what that means. e is a multiple of a; d is a multiple of e and ' +
'therefore of a; c is a multiple of d and therefore of a. So <b>a tuple (c, d) is deleted precisely ' +
'when c is a multiple of a</b>. Deleting a row wipes out everything that is a multiple of it, at any ' +
'depth. Options phrased in terms of <i>factors</i> have the relationship backwards.</p>')}
<p>The lesson: <code>ON DELETE CASCADE</code> is convenient and it hands the database permission to
delete rows you never named. Follow the chain before declaring it.</p>
</section>

<section>
<h2>6. Creating and Changing Tables</h2>
<p>These are the <b>DDL</b> commands from Chapter 1: they define the schema.</p>
<pre><code><span class="kw">CREATE TABLE</span> student (
    id        <span class="kw">INT</span>,
    name      <span class="kw">VARCHAR</span>(30) <span class="kw">NOT NULL</span>,
    dept_name <span class="kw">VARCHAR</span>(20),
    tot_cred  <span class="kw">NUMERIC</span>(3, 0) <span class="kw">CHECK</span> (tot_cred &gt;= 0),
    <span class="kw">PRIMARY KEY</span> (id)
);</code></pre>
<p>The primary key can be declared two ways: beside the column, as
<code>id INT PRIMARY KEY</code>, or on its own line as above. <b>The separate line is the form you
need for a composite key</b>, because <code>PRIMARY KEY (id, course_id)</code> has nowhere else to
go.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Constraint</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>PRIMARY KEY</code></td><td>Unique <b>and</b> not null, both at once, automatically</td></tr>
<tr><td><code>NOT NULL</code></td><td>A value must be supplied. Leaving it out is refused</td></tr>
<tr><td><code>UNIQUE</code></td><td>No two rows may share this value, but unlike a primary key it <i>may</i> be missing</td></tr>
<tr><td><code>CHECK (condition)</code></td><td>Any condition you like, tested on every insert and update</td></tr>
<tr><td><code>DEFAULT value</code></td><td>Used when no value is given</td></tr>
<tr><td><code>FOREIGN KEY</code></td><td>Must match a key in the parent table</td></tr>
</tbody></table></div>
<p>Two commands change a table after it exists.</p>
<pre><code><span class="cm">-- add a column</span>
<span class="kw">ALTER TABLE</span> student <span class="kw">ADD</span> phone_number <span class="kw">VARCHAR</span>(10);

<span class="cm">-- change a column&rsquo;s type</span>
<span class="kw">ALTER TABLE</span> student <span class="kw">ALTER COLUMN</span> grade <span class="kw">TYPE</span> <span class="kw">CHAR</span>(1);

<span class="cm">-- remove the table entirely</span>
<span class="kw">DROP TABLE</span> student;</code></pre>
<p><code>ALTER</code> is the general-purpose editor: add a column, remove a column, change a data
type, add or change a primary key, add a foreign key. You never rewrite the whole schema to change
one thing.</p>
<p><code>DROP</code> removes the <b>table itself</b>, which then no longer exists, and you would
have to <code>CREATE</code> it again. And it is <b>refused if another table references this
one</b>, because that would leave the child table pointing at nothing.</p>
</section>

<section>
<h2>7. Putting Data In, Changing It, Taking It Out</h2>
<p>These are the <b>DML</b> commands: they change the instance, not the schema.</p>
<pre><code><span class="cm">-- positional: values must match the column order exactly</span>
<span class="kw">INSERT INTO</span> student <span class="kw">VALUES</span> (101, <span class="st">'Rahul'</span>, <span class="st">'Comp. Sci.'</span>, 65);

<span class="cm">-- named: safer, and any column you leave out becomes NULL</span>
<span class="kw">INSERT INTO</span> student (id, name) <span class="kw">VALUES</span> (102, <span class="st">'Priya'</span>);

<span class="kw">UPDATE</span> student <span class="kw">SET</span> tot_cred = 70 <span class="kw">WHERE</span> id = 101;

<span class="kw">DELETE FROM</span> student <span class="kw">WHERE</span> id = 101;</code></pre>
<p>Every value must satisfy the column&rsquo;s declared domain and every constraint, or <b>the whole
statement is refused</b> and nothing is half-inserted. That is atomicity from Chapter 1, at the
smallest possible scale.</p>
<p>The named form is worth preferring. It survives someone adding a column later, and it makes the
NULL behaviour explicit: <b>a column you do not mention is left NULL</b>, which is refused if that
column is <code>NOT NULL</code>.</p>
<p>Both <code>UPDATE</code> and <code>DELETE</code> take a <code>WHERE</code> clause, and it decides
<b>which rows</b>. Leave it off and every row is affected, which is usually a disaster.
<code>DELETE FROM student WHERE tot_cred &lt; 10</code> removes <b>every</b> matching row, not one.</p>
<p>To empty a table completely there is a separate, faster command:</p>
<pre><code><span class="kw">TRUNCATE TABLE</span> student;   <span class="cm">-- all rows gone, the table remains</span></code></pre>
<div class="eq"><span class="v">DELETE</span> removes chosen rows <span class="op">&middot;</span> <span class="v">TRUNCATE</span> removes all rows <span class="op">&middot;</span> <span class="v">DROP</span> removes the table
<span class="eqn">the first two leave the table standing; the third does not</span></div>
</section>

<section>
<h2>8. The Shape of a Query</h2>
<p>Everything you retrieve for the next two chapters has this shape.</p>
<pre><code><span class="kw">SELECT</span> name, dept_name   <span class="cm">-- which columns you want back</span>
<span class="kw">FROM</span>   instructor        <span class="cm">-- which table they live in</span>
<span class="kw">WHERE</span>  dept_name = <span class="st">'Biology'</span>;  <span class="cm">-- which rows to keep</span></code></pre>
<dl class="tight">
  <dt><code>SELECT</code></dt>
  <dd>The <b>attributes</b> you want in the answer. <code>SELECT *</code> means every column.</dd>
  <dt><code>FROM</code></dt>
  <dd>The table or tables to read.</dd>
  <dt><code>WHERE</code></dt>
  <dd>The condition each row must satisfy. Rows failing it are discarded. This clause is
  optional.</dd>
</dl>
<p>Conditions combine with <code>AND</code>, <code>OR</code> and <code>NOT</code>, and compare with
<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>,
<code>&gt;=</code>.</p>
<p>One warning to carry from here on: <b>an aggregate function such as <code>MAX</code> can never
appear in a <code>WHERE</code> clause.</b> Section 14 explains why, and section 15 shows the trick
for getting a minimum without one.</p>
</section>

<section>
<h2>9. DISTINCT and AS</h2>
<p>Two small keywords that appear in almost every query.</p>
<p><b><code>DISTINCT</code></b> removes duplicate rows from the <b>answer</b>. Five students in
Biology give five rows; <code>SELECT DISTINCT dept_name FROM student</code> returns Biology once.
The stored table is untouched, and only the answer is de-duplicated.</p>
<p>This matters because a relation is a set, so mathematically there should never be duplicates.
SQL relaxes that for practical reasons, which is why you sometimes have to ask.</p>
<p><b><code>AS</code></b> renames something for the duration of the query. It does two jobs:</p>
<pre><code><span class="cm">-- rename a column in the result</span>
<span class="kw">SELECT</span> name <span class="kw">AS</span> student_name, tot_cred <span class="kw">AS</span> credits <span class="kw">FROM</span> student;

<span class="cm">-- rename a table, called aliasing. The AS is optional here</span>
<span class="kw">SELECT</span> s.name <span class="kw">FROM</span> student <span class="kw">AS</span> s <span class="kw">WHERE</span> s.tot_cred &gt; 50;</code></pre>
<p>Aliasing looks like mere convenience and is not. Section 15 needs <b>two copies of one table</b>
in a single query, and without two names there is no way to say which copy you mean.</p>
<p>To see only the first few rows, PostgreSQL uses <code>LIMIT</code>: <code>SELECT * FROM student
LIMIT 3</code>. Some other systems use <code>TOP</code>; PostgreSQL does not have it.</p>
</section>

<section>
<h2>10. Missing Values: NULL</h2>
${teach('NULL', 'the absence of a value', [
  'A marker meaning "there is no value here": unknown, or not applicable.',
  'Because refusing to store a row just because one optional fact is missing would be worse than storing it with a gap.',
  'A blank box on a form. Blank does not mean zero, and it does not mean the empty word "": it means nobody answered.',
  'A player who has not played a rated game yet has <code>rating = NULL</code>. Not 0, which would mean they played and scored nothing.',
  'NULL is not a value. It is the <b>absence</b> of one, which is why it does not behave like one.',
  'A special marker denoting that a data value does not exist in the database.',
])}
<p>Everything odd about NULL follows from one rule: <b>any comparison with NULL yields
<i>unknown</i></b>, not true and not false. SQL therefore has <b>three</b> truth values, not two.</p>
<div class="eq"><span class="v">true</span> <span class="op">&middot;</span> <span class="v">false</span> <span class="op">&middot;</span> <span class="v">unknown</span>
<span class="eqn">and WHERE keeps only the rows whose condition came out true</span></div>
<p>Since <code>WHERE</code> keeps only <i>true</i>, unknown rows are dropped exactly like false
ones. This produces the result people find hardest to accept:</p>
<p><code>rating &gt; 1200</code> and <code>rating &lt;= 1200</code> ought to catch every player
alive, and they do not. A player with no rating fails <b>both</b>, because both comparisons are
unknown.</p>
<p>So there are special operators, and they are the only correct way to test for a missing value:</p>
<pre><code><span class="kw">SELECT</span> * <span class="kw">FROM</span> player <span class="kw">WHERE</span> rating <span class="kw">IS NULL</span>;
<span class="kw">SELECT</span> * <span class="kw">FROM</span> player <span class="kw">WHERE</span> rating <span class="kw">IS NOT NULL</span>;</code></pre>
<p><code>rating = NULL</code> is <b>not an error</b>. It simply never matches anything, which makes
it far more dangerous than an error would be: the query runs, returns nothing, and says nothing was
wrong.</p>
${fig('f-null',
`<div class="panel">
  <div class="phead"><span class="m" id="nl-cond"></span><span class="m" id="nl-cnt"></span></div>
  <table class="dt" id="nl-tbl"></table>
  <div class="msg" id="nl-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.6, The unrated player against six conditions. Only the last two find them.',
`<span class="lab">WHERE:</span>${pills('nl', [['gt', 'rating &gt; 1200'], ['le', 'rating &lt;= 1200'], ['eq', 'rating = NULL'], ['ne', 'rating &lt;&gt; NULL'], ['isn', 'rating IS NULL'], ['nn', 'rating IS NOT NULL']], 0)}`,
'a comparison with NULL is unknown, and WHERE keeps only what is true')}
<p>One more consequence, used in Chapter 3: <b>aggregate functions ignore NULLs</b>. So
<code>AVG(rating)</code> divides by the number of players who actually have a rating, not by the
number of rows.</p>
</section>

<section>
<h2>11. Matching Text with LIKE</h2>
<p><code>=</code> compares text exactly. Matching a <b>pattern</b> needs <code>LIKE</code>, which
understands exactly two wildcards and only two.</p>
<dl class="tight">
  <dt><code>%</code> percent</dt>
  <dd>Matches <b>any run</b> of characters, <b>including none at all</b>. That "including none" is
  the part people forget.</dd>
  <dt><code>_</code> underscore</dt>
  <dd>Matches <b>exactly one</b> character. Not zero, not two.</dd>
</dl>
${wex('Worked: SELECT salary FROM department WHERE salary LIKE &rsquo;30%5_%&rsquo;',
'<p style="margin:0 0 8px">Read the pattern piece by piece: <code>30</code>, then anything at all, ' +
'then <code>5</code>, then exactly one character, then anything at all.</p>' +
mini(['value', 'matches?', 'why'],
  [['305500', ['yes', 'hi'], '30, then nothing, then 5, then 5, then 00'],
   ['305005', ['yes', 'hi'], '30, then nothing, then 5, then 0, then 05'],
   ['3050', ['no', 'lo'], 'after 30 and 5 there is only one character left, and the pattern needs at least two'],
   ['30050', ['no', 'lo'], 'the last 5 leaves no character for the underscore to match']]) +
'<p style="margin:8px 0 0">The trap is the underscore: it demands a character, so the string must ' +
'have <b>at least one</b> character after the 5.</p>')}
<p>Two more shapes worth memorising, because they turn a description straight into a pattern:</p>
<ul>
  <li><code>'___'</code>, three underscores, means <b>exactly</b> three characters.</li>
  <li><code>'___%'</code> means <b>at least</b> three, since the percent may match nothing.</li>
</ul>
${fig('f-like',
`<div class="panel">
  <div class="phead"><span class="m" id="lk-p"></span><span class="m" id="lk-cnt"></span></div>
  <table class="dt" id="lk-tbl"></table>
  <div class="msg" id="lk-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.7, Six patterns against the same values. Each one fails differently.',
`<span class="lab">pattern:</span>${pills('lk', [['a', "'30%5_%'"], ['b', "'___'"], ['c', "'___%'"], ['d', "'%50%'"], ['e', "'30%'"], ['f', "'_0%'"]], 0)}`,
'a percent may match nothing; an underscore must match exactly one character')}
</section>

<section>
<h2>12. BETWEEN and IN</h2>
<p>Two abbreviations that make conditions readable.</p>
<pre><code><span class="cm">-- these two mean exactly the same thing</span>
<span class="kw">WHERE</span> salary <span class="kw">BETWEEN</span> 90000 <span class="kw">AND</span> 100000
<span class="kw">WHERE</span> salary &gt;= 90000 <span class="kw">AND</span> salary &lt;= 100000

<span class="cm">-- and so do these</span>
<span class="kw">WHERE</span> dept_name <span class="kw">IN</span> (<span class="st">'Comp. Sci.'</span>, <span class="st">'Finance'</span>, <span class="st">'Physics'</span>)
<span class="kw">WHERE</span> dept_name = <span class="st">'Comp. Sci.'</span> <span class="kw">OR</span> dept_name = <span class="st">'Finance'</span>
   <span class="kw">OR</span> dept_name = <span class="st">'Physics'</span></code></pre>
<p><b><code>BETWEEN</code> is inclusive at both ends.</b> A salary of exactly 90,000 is included.
<code>NOT BETWEEN</code> and <code>NOT IN</code> negate each.</p>
<p><code>IN</code> becomes far more powerful in Chapter 3, where the list is replaced by a whole
subquery rather than typed-out values.</p>
</section>

<section>
<h2>13. Sorting with ORDER BY</h2>
<p>A relation is a set, so <b>without <code>ORDER BY</code> no order is promised at all</b>. If you
need a particular order, you must ask.</p>
<pre><code><span class="kw">SELECT</span>   city_code, state, city
<span class="kw">FROM</span>     weather_report
<span class="kw">ORDER BY</span> state <span class="kw">ASC</span>, city <span class="kw">DESC</span>;</code></pre>
<p>The sort runs strictly <b>left to right</b>. The first column decides the order; the second only
decides the order <i>within</i> rows that already tie on the first. <code>ASC</code> is the default
and may be left out.</p>
<p>Working out the answer to a question like the one above is a two-pass job, and doing it in that
order by hand is the reliable method:</p>
<ol>
  <li>Sort the whole table by <code>state</code>.</li>
  <li><b>Within each state</b>, sort by <code>city</code>.</li>
  <li>Only then project the column actually asked for, here <code>city_code</code>.</li>
</ol>
<p>Notice the sorting columns need not appear in the <code>SELECT</code> list. You can sort by
something you never display.</p>
${fig('f-ord',
`<div class="panel">
  <div class="phead"><span class="m" id="or-hd"></span><span class="m" id="or-cnt"></span></div>
  <table class="dt" id="or-tbl"></table>
  <div class="msg" id="or-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.8, One table, sorted four ways. Watch the second key change only the order within a group.',
`<span class="lab">ORDER BY:</span>${pills('or', [['n', 'nothing'], ['s', 'state'], ['sc', 'state ASC, city DESC'], ['sa', 'state ASC, city ASC'], ['c', 'city ASC']], 0)}`,
'the first column decides the order; later columns only break ties')}
</section>

<section>
<h2>14. Aggregate Functions and GROUP BY</h2>
<p>Every query so far returned rows that already existed. An <b>aggregate</b> reads a whole column
and returns one value.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Function</th><th>Returns</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>COUNT(*)</code></td><td>how many rows</td><td>Counts rows, so NULLs make no difference</td></tr>
<tr><td><code>COUNT(col)</code></td><td>how many non-null values</td><td>Rows where col is NULL are skipped</td></tr>
<tr><td><code>SUM(col)</code></td><td>the total</td><td>NULLs ignored</td></tr>
<tr><td><code>AVG(col)</code></td><td>the mean</td><td>Divides by the count of <b>non-null</b> values</td></tr>
<tr><td><code>MIN(col)</code>, <code>MAX(col)</code></td><td>smallest, largest</td><td>NULLs ignored</td></tr>
</tbody></table></div>
<p><b><code>GROUP BY</code></b> splits the rows into piles sharing a value and runs the aggregate
once per pile. Grouping by <b>two</b> columns means rows must agree on <i>both</i> to land in the
same pile.</p>
<pre><code><span class="kw">SELECT</span>   age, country, <span class="kw">COUNT</span>(*)
<span class="kw">FROM</span>     students
<span class="kw">GROUP BY</span> age, country;</code></pre>
<p>Read that as: every row with age 13 <b>and</b> country Australia becomes one output row, with a
count of how many there were. Rows with age 13 and a different country form a separate group.</p>
<p><b>Every column in the <code>SELECT</code> list must either appear in the <code>GROUP BY</code>
or sit inside an aggregate.</b> The reason is what an output row now <i>means</i>: it stands for a
whole pile, so a bare column with several different values in the pile has no single answer.</p>
${fig('f-grp',
`<div class="panel">
  <div class="phead"><span class="m" id="gp-hd"></span><span class="m" id="gp-cnt"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">students</div><table class="dt" id="gp-src"></table></div>
    <div><div class="tname">result</div><table class="dt" id="gp-out"></table></div>
  </div>
  <div class="msg" id="gp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.9, The same table grouped four ways. Grouping by more columns always gives more, smaller groups.',
`<span class="lab">GROUP BY:</span>${pills('gp', [['ac', 'age, country'], ['a', 'age'], ['c', 'country'], ['n', 'name (all distinct)']], 0)}`,
'grouping by more columns gives more groups, each with fewer rows')}
<p>A condition on an aggregate goes in <b><code>HAVING</code></b>, never in <code>WHERE</code>,
and <code>HAVING</code> is only legal alongside <code>GROUP BY</code>.</p>
<p>The reason is timing. <code>WHERE</code> runs <b>before</b> the groups exist, so at that moment
there are no averages or maxima to compare against, only individual rows. Chapter 3 sets out the
full eight-stage order of execution.</p>
<div class="eq"><span class="v">WHERE</span> filters rows, before grouping <span class="op">&middot;</span> <span class="v">HAVING</span> filters groups, after
<span class="eqn">so WHERE rainfall = MAX(rainfall) is always wrong</span></div>
${wex('Worked: how many rows does this query return?',
'<pre style="margin:0 0 8px"><code><span class="kw">SELECT</span>   s.sup_num, <span class="kw">SUM</span>(p.part_qty)\n' +
'<span class="kw">FROM</span>     suppliers s, parts p\n' +
'<span class="kw">WHERE</span>    p.part_qty &gt; 30 <span class="kw">AND</span> s.sup_num = p.sup_num\n' +
'<span class="kw">GROUP BY</span> s.sup_num;</code></pre>' +
'<p style="margin:0">Work it in execution order. <b>1.</b> <code>FROM</code> forms the Cartesian ' +
'product of the two tables. <b>2.</b> <code>WHERE</code> throws away every pair whose supplier ' +
'numbers disagree, and every row with quantity 30 or less. <b>3.</b> <code>GROUP BY</code> collapses ' +
'what survives to <b>one row per distinct supplier number</b>. So the answer is not the number of ' +
'parts: it is <b>how many different suppliers still appear after the filtering</b>. Count the ' +
'distinct supplier numbers in the filtered rows and that is your number.</p>')}
</section>

<section>
<h2>15. Combining Whole Queries</h2>
<p>Two complete queries can be combined the way two sets are combined in mathematics.</p>
<div class="tw"><table class="pt">
<thead><tr><th>SQL</th><th>Set operation</th><th>Keeps</th><th>Duplicates</th></tr></thead>
<tbody>
<tr><td><code>UNION</code></td><td>A &cup; B</td><td>rows in either</td><td><b>removed</b></td></tr>
<tr><td><code>UNION ALL</code></td><td>A &cup; B, as a bag</td><td>rows in either</td><td>kept, and faster</td></tr>
<tr><td><code>INTERSECT</code></td><td>A &cap; B</td><td>rows in both</td><td>removed</td></tr>
<tr><td><code>EXCEPT</code></td><td>A &minus; B</td><td>rows in A but not in B</td><td>removed</td></tr>
</tbody></table></div>
<p>A naming difference worth knowing, since questions mention it: <b><code>EXCEPT</code> is what
PostgreSQL and SQLite call set difference, while MySQL and Oracle call it <code>MINUS</code>.</b>
The operation is the same.</p>

<h3>Union compatibility</h3>
<p>Before any set operation can happen, the two sides must satisfy three rules.</p>
<ol>
  <li><b>The same number of columns</b> in both.</li>
  <li><b>Corresponding columns must have compatible types.</b> The names may differ; only the types
  have to match.</li>
  <li><b>The same column order</b>, since "corresponding" is decided by position, not by name.</li>
</ol>

<h3>Set difference in practice</h3>
<p>"In this group but not that one" is always set difference. Recognising that phrasing is most of
the work.</p>
${wex('Worked: suppliers who supply part 301 but not part 304',
'<pre style="margin:0 0 8px"><code><span class="kw">SELECT</span> sup_name <span class="kw">FROM</span> suppliers s, parts p\n' +
'<span class="kw">WHERE</span>  s.sup_num = p.sup_num <span class="kw">AND</span> part_num = 301\n' +
'<span class="kw">EXCEPT</span>\n' +
'<span class="kw">SELECT</span> sup_name <span class="kw">FROM</span> suppliers s, parts p\n' +
'<span class="kw">WHERE</span>  s.sup_num = p.sup_num <span class="kw">AND</span> part_num = 304;</code></pre>' +
'<p style="margin:0">Why the obvious attempts fail. <code>part_num = 301 AND part_num &lt;&gt; 304</code> ' +
'tests <b>one row at a time</b>, and a single row cannot have two part numbers, so the condition is ' +
'trivially true for every 301 row and excludes nobody. <code>part_num = 301 OR part_num &lt;&gt; 304</code> ' +
'is even looser. The question is about a supplier <b>across all their rows</b>, and only a set ' +
'operation can express that.</p>')}

<h3>Finding a minimum without MIN</h3>
<p>This one is worth studying closely, because it teaches a way of thinking rather than a keyword.
The question: <i>find the city with the minimum rainfall.</i></p>
<p>The tempting answers are both illegal. <code>WHERE rainfall = MAX(rainfall)</code> fails because
an aggregate may not appear in <code>WHERE</code>. <code>HAVING rainfall = MAX(rainfall)</code>
fails because <code>HAVING</code> requires <code>GROUP BY</code>.</p>
<p>So turn the question around. Instead of asking which city is smallest, ask <b>which cities are
<i>not</i> smallest, and subtract them</b>.</p>
<pre><code><span class="kw">SELECT DISTINCT</span> city
<span class="kw">FROM</span>   weather_report
<span class="kw">EXCEPT</span>
<span class="kw">SELECT DISTINCT</span> t1.city
<span class="kw">FROM</span>   weather_report <span class="kw">AS</span> t1, weather_report <span class="kw">AS</span> t2
<span class="kw">WHERE</span>  t1.rainfall &gt; t2.rainfall;</code></pre>
<p>Take it in three pieces.</p>
<dl class="tight">
  <dt>The first query</dt>
  <dd>Every city.</dd>
  <dt>The second query</dt>
  <dd>The table is joined <b>to itself</b> under two names, so each city can be compared with every
  other. A city appears here if there is <i>some</i> city with less rainfall than it, which means
  every city <b>except the smallest</b>.</dd>
  <dt>The subtraction</dt>
  <dd>All cities, minus all-but-the-smallest, leaves exactly the smallest.</dd>
</dl>
<p>And notice why the self-join alone is not the answer. Selecting
<code>WHERE t1.rainfall &lt; t2.rainfall</code> gives every city that is smaller than <i>some</i>
other city, which is every city except the <b>largest</b>. That is a different question, and it is a
common wrong option.</p>
${fig('f-min',
`<div class="panel">
  <div class="phead"><span class="m" id="mn-hd"></span><span class="m" id="mn-cnt"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">weather_report</div><table class="dt" id="mn-src"></table></div>
    <div><div class="tname" id="mn-rl">result</div><table class="dt" id="mn-out"></table></div>
  </div>
  <div class="msg" id="mn-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.10, Building the answer in stages. The middle step is the one that does the real work.',
`<span class="lab">query:</span>${pills('mn', [['all', 'all cities'], ['gt', 'the self-join: t1.rainfall &gt; t2.rainfall'], ['exc', 'the EXCEPT'], ['lt', 'the wrong one: t1 &lt; t2']], 0)}`,
'subtracting "everything but the smallest" from "everything" leaves the smallest')}
</section>

<section>
<h2>16. Two Tables at Once</h2>
<p>Naming two tables in the <code>FROM</code> clause gives their <b>Cartesian product</b>: every row
of the first paired with every row of the second.</p>
<pre><code><span class="kw">SELECT</span> * <span class="kw">FROM</span> instructor, department;   <span class="cm">-- every pairing</span></code></pre>
<p>If instructor has 12 rows and department has 7, that is 84 rows, and most are meaningless. So you
add a condition saying which pairs are real:</p>
<pre><code><span class="kw">SELECT</span> name, budget
<span class="kw">FROM</span>   instructor, department
<span class="kw">WHERE</span>  instructor.dept_name = department.dept_name;</code></pre>
<p>That is a join written by hand, and Chapter 3 does it properly with join keywords.</p>
<p>When a column name appears in <b>both</b> tables, writing it alone is <b>ambiguous</b> and the
system refuses the query, because it genuinely cannot tell which one you mean. Qualify it as
<code>instructor.dept_name</code>, or alias the tables and write <code>i.dept_name</code>. Where a
column name appears in only one of the tables, no qualification is needed.</p>

<h3>Natural join, in one paragraph</h3>
<p>A <b>natural join</b> does the matching for you. It finds every column the two tables share
<b>by name</b>, keeps only the pairs that agree on all of them, and shows each shared column
once.</p>
<p>The reason it exists is the reason the Cartesian product is unusable on its own. If student
Jagjit is in Electronics, the raw product pairs him with the Computer Science department row as
well, which is meaningless. Matching on the shared column name throws that pair away
automatically.</p>
<div class="eq">R &#8904; S &nbsp;=&nbsp; &pi;<sub>each attribute once</sub>( &sigma;<sub>shared columns agree</sub>( R &times; S ) )
<span class="eqn">product, then selection, then projection: Chapter 4 takes this apart</span></div>
<p>Chapter 3 covers the join keywords in full, including why natural join is dangerous when the
tables share more than one column name.</p>
${fig('f-cart',
`<div class="panel">
  <div class="phead"><span class="m" id="cp-hd"></span><span class="m" id="cp-cnt"></span></div>
  <table class="dt" id="cp-tbl"></table>
  <div class="msg" id="cp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 2.11, The product, then the matching condition, then the natural join. Same rows, three views.',
`<span class="lab">show:</span>${pills('cp', [['prod', 'the full product'], ['cond', 'with the matching condition'], ['nat', 'as a natural join']], 0)}`,
'a join is the product with the meaningless pairs removed')}
${cyu('The employee table has 100 rows and the designation table has 6. desgID is a foreign key in employee referencing designation. What is the maximum number of rows returned by SELECT * FROM employee NATURAL JOIN designation?',
'<b>100.</b> Because <code>desgID</code> is a foreign key, <b>every</b> employee row is guaranteed to have exactly one matching designation row, so no employee row is lost and none is duplicated. The converse does not hold: a designation with no employees simply contributes nothing. So the join has as many rows as the <b>child</b> table, 100. The Cartesian product would have given 600, and the natural join throws away the 500 pairs that do not match.')}
</section>

</article>` + cfoot('week-2');
}

function initWeek2() {
  const STU = [['101', 'Rahul', 'Comp. Sci.', 65], ['102', 'Priya', 'Biology', 48],
    ['103', 'Arjun', 'Comp. Sci.', 72], ['104', 'Nita', 'Physics', 30]];

  /* ---- Fig 2.1 anatomy ---- */
  (function () {
    const H = ['id', 'name', 'dept_name', 'tot_cred'];
    const N = {
      rel: ['the whole table', 'A <b>relation</b> is the entire table: a set of rows over the same named columns. Because it is a <i>set</i>, the order of the rows means nothing and no row should ever appear twice.'],
      att: ['one column', 'An <b>attribute</b> is one named column, holding the same kind of fact about every row. <code>dept_name</code> is the attribute; <b>Comp. Sci.</b> and <b>Biology</b> are <i>values</i> of it, not attributes.'],
      tup: ['one row', 'A <b>tuple</b> is one complete row: one full record. Tuples have no order, so the database may return them in any sequence unless you use <code>ORDER BY</code>.'],
      val: ['one cell', 'A single <b>value</b>: the intersection of one tuple and one attribute. It must lie in that attribute&rsquo;s <b>domain</b>.'],
      deg: ['4 columns', '<b>Degree</b> is the number of attributes, here <b>4</b>. It changes only when the schema changes, which is rare.'],
      card: ['4 rows', '<b>Cardinality</b> is the number of tuples, here <b>4</b>. It changes with every insert and delete. Remember it by the everyday meaning: the size of a set, and the set is the set of rows.'],
    };
    function draw(k) {
      $('#an-tbl').innerHTML = '<thead><tr>' + H.map((h, j) =>
        `<th class="${k === 'att' && j === 2 ? 'hl' : ''}" ` +
        `style="${k === 'deg' ? 'color:var(--indigo)' : ''}">${h}</th>`).join('') +
        '</tr></thead><tbody>' + STU.map((r, i) => {
        const rowHi = (k === 'tup' && i === 1) || (k === 'card');
        return `<tr class="${rowHi ? (k === 'card' ? 'cu' : 'hi') : ''}">` + r.map((v, j) => {
          const cellHi = (k === 'att' && j === 2) || (k === 'val' && i === 1 && j === 1);
          return `<td class="${cellHi ? 'hl' : ''}">${v}</td>`;
        }).join('') + '</tr>';
      }).join('') + '</tbody>';
      $('#an-cnt').textContent = k ? N[k][0] : 'degree 4, cardinality 4';
      $('#an-note').innerHTML = k ? N[k][1]
        : 'Pick a term. Everything in this chapter is described using these six words, so it is worth fixing them now.';
    }
    setPills($('#f-anat'), 'an', draw);
    draw(null);
  })();

  /* ---- Fig 2.2 char vs varchar ---- */
  (function () {
    const NAMES = ['Li', 'Rahul', 'Priyanka', 'Venkataraman'];
    function draw() {
      const n = +$('#dm-n').value;
      $('#dm-n-v').textContent = n;
      $('#dm-tbl').innerHTML = '<thead><tr><th>value</th><th>length</th>' +
        `<th>CHAR(${n})</th><th>VARCHAR(${n})</th></tr></thead><tbody>` +
        NAMES.map(v => {
          const fits = v.length <= n;
          const ch = fits ? v + '&middot;'.repeat(n - v.length) : 'rejected';
          const vc = fits ? v : 'rejected';
          return `<tr class="${fits ? '' : 'lo'}"><td>${v}</td><td>${v.length}</td>` +
            `<td>${fits ? ch + ' <span style="color:var(--muted)">(' + n + ')</span>' : '<b>' + ch + '</b>'}</td>` +
            `<td>${fits ? vc + ' <span style="color:var(--muted)">(' + v.length + ')</span>' : '<b>' + vc + '</b>'}</td></tr>`;
        }).join('') + '</tbody>';
      const nfit = NAMES.filter(v => v.length <= n).length;
      $('#dm-hd').textContent = 'declared length ' + n;
      $('#dm-use').textContent = nfit + ' of ' + NAMES.length + ' values fit';
      $('#dm-note').innerHTML = 'The dots are <b>padding</b>. <code>CHAR(' + n + ')</code> always ' +
        'occupies ' + n + ' characters, so a two-letter name still takes ' + n +
        '. <code>VARCHAR(' + n + ')</code> stores only what you gave it. ' +
        (nfit < NAMES.length
          ? 'Values longer than ' + n + ' are <b>rejected by both</b>: the declared length is a hard limit either way.'
          : 'Everything fits at this length, so the only difference is the wasted space in the CHAR column.');
      $('#f-dom-msg').textContent = 'CHAR pads to exactly n; VARCHAR stores only what you gave it';
    }
    $('#dm-n').oninput = draw;
    draw();
  })();

  /* ---- Fig 2.3 keys ---- */
  (function () {
    const U = [['u1', 'chessfan', 21, 1400], ['u2', 'chessfan', 21, 1550],
      ['u3', 'rookmaster', 19, 1400], ['u4', 'pawnstar', 21, 1550]];
    const K = {
      id: [[0], '{user_id}', '<b>Candidate key.</b> Every value is different, and it is a single attribute so it cannot be made smaller. This is the one to choose as the primary key.'],
      un: [[1], '{username}', '<b>Not a key at all.</b> Rows u1 and u2 both show <code>chessfan</code>, because this application deliberately allows different users to pick the same display name. One counterexample is enough.'],
      iu: [[0, 1], '{user_id, username}', '<b>Superkey, but not a candidate key.</b> It does identify every row, because user_id alone already does. But username is doing no work, so the set is <b>not minimal</b> and it fails the candidate-key test.'],
      ua: [[1, 3], '{username, age}', '<b>Not a key.</b> u1 and u2 agree on both username and age, so they still cannot be told apart. Adding an attribute does not always help.'],
      ar: [[2, 3], '{age, rating}', '<b>Not a key.</b> u2 and u4 both show age 21 and rating 1550. This one looks plausible until you check the data, which is exactly why you must check.'],
    };
    const H = ['user_id', 'username', 'age', 'rating'];
    function draw(k) {
      const [cols, name, note] = K[k];
      const seen = {}; let bad = [];
      U.forEach((r, i) => {
        const key = cols.map(c => r[c]).join('|');
        if (seen[key] !== undefined) bad = [seen[key], i]; else seen[key] = i;
      });
      const ok = bad.length === 0;
      const minimal = ok && cols.some(() => true) &&
        !cols.some((_, drop) => {
          if (cols.length === 1) return false;
          const sub = cols.filter((__, j) => j !== drop);
          const s2 = {}; let dup = false;
          U.forEach(r => { const kk = sub.map(c => r[c]).join('|'); if (s2[kk]) dup = true; s2[kk] = 1; });
          return !dup;
        });
      $('#ky-tbl').innerHTML = '<thead><tr>' + H.map((h, j) =>
        `<th style="color:${cols.includes(j) ? 'var(--indigo)' : 'var(--muted)'}">${h}</th>`).join('') +
        '</tr></thead><tbody>' + U.map((r, i) =>
          `<tr class="${bad.includes(i) ? 'lo' : ''}">` + r.map((v, j) =>
            `<td${cols.includes(j) ? ' class="hl"' : ''}>${v}</td>`).join('') + '</tr>').join('') +
        '</tbody>';
      $('#ky-hd').innerHTML = name;
      $('#ky-verd').textContent = !ok ? 'not a superkey'
        : minimal ? 'candidate key' : 'superkey, not minimal';
      $('#ky-note').innerHTML = note;
      const m = $('#f-key-msg');
      m.className = 'msg ' + (ok ? (minimal ? 'good' : '') : 'bad');
      m.textContent = ok ? 'a superkey identifies; a candidate key identifies with nothing spare'
        : 'Two highlighted rows agree on the whole set, so it cannot identify rows. One counterexample is enough.';
    }
    setPills($('#f-key'), 'ky', draw);
    draw('id');
  })();

  /* ---- Fig 2.4 counting superkeys ---- */
  (function () {
    const AT = ['A', 'B', 'C', 'D'];
    const K = {
      a: [[['A']], '2<sup>4&minus;1</sup> = 8'],
      b: [[['A', 'B']], '2<sup>4&minus;2</sup> = 4'],
      c: [[['A'], ['B']], '8 + 8 &minus; 4 = 12'],
      d: [[['A', 'B'], ['C', 'D']], '4 + 4 &minus; 1 = 7'],
    };
    function draw(k) {
      const [keys, formula] = K[k];
      const subs = [];
      for (let m = 1; m < 16; m++) {
        const s = AT.filter((_, i) => m & (1 << i));
        subs.push([s.join(''), s.length, keys.some(key => key.every(a => s.includes(a)))]);
      }
      subs.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
      const n = subs.filter(s => s[2]).length;
      $('#ct-tbl').innerHTML = '<thead><tr><th>subset</th><th>size</th><th>superkey?</th></tr></thead><tbody>' +
        subs.map(s => `<tr class="${s[2] ? 'hi' : 'out'}"><td>${s[0]}</td><td>${s[1]}</td>` +
          `<td>${s[2] ? 'yes' : 'no'}</td></tr>`).join('') + '</tbody>';
      $('#ct-hd').innerHTML = 'candidate keys: ' + keys.map(x => '{' + x.join(', ') + '}').join(' and ');
      $('#ct-tot').innerHTML = formula + ' = <b>' + n + '</b>';
      $('#ct-note').innerHTML = keys.length === 1
        ? 'One candidate key of size ' + keys[0].length + ' in a relation of 4 attributes. The other ' +
          (4 - keys[0].length) + ' attributes are each free to be present or absent, giving 2<sup>' +
          (4 - keys[0].length) + '</sup> = <b>' + n + '</b>.'
        : 'Two candidate keys. Each contributes its own count, but sets containing <b>both</b> keys ' +
          'were counted twice, so the overlap is subtracted once. Counting the highlighted rows gives <b>' +
          n + '</b>, which matches.';
      $('#f-cnt-msg').textContent = 'Arithmetic says ' + n + ', enumeration says ' + n +
        '. Adding the per-key counts without subtracting the overlap would over-count.';
    }
    setPills($('#f-cnt'), 'ct', draw);
    draw('a');
  })();

  /* ---- Fig 2.5 referential integrity ---- */
  (function () {
    const P = [['101', 'Rahul'], ['102', 'Priya'], ['103', 'Arjun']];
    const C = [['101', 'BIO-101'], ['103', 'CS-319']];
    const S = {
      none: [P, C, null, 'as stored', 'Every <code>id</code> in <b>takes</b> appears in <b>student</b>, so referential integrity holds. Note that student 102 has no loan row at all, which is perfectly fine: the rule runs child to parent, not the other way.'],
      ok: [P, C.concat([['102', 'DBMS']]), true, 'insert accepted',
        'Student 102 exists in the parent table, so the child row is allowed. Nothing else has to be true.'],
      bad: [P, C.concat([['999', 'DBMS']]), false, 'insert refused',
        'There is no student 999, so this row would be a <b>pointer to nowhere</b>. The database refuses it. Without this rule the table would be asserting something false about the world.'],
      del: [P, C, false, 'delete refused',
        'Student 101 is still referenced by a row in <b>takes</b>. Deleting the parent would orphan the child, so the delete is <b>refused</b>. You must remove the child rows first, or declare <code>ON DELETE CASCADE</code> to have them removed automatically.'],
      drop: [P, C, false, 'drop refused',
        'For the same reason, <code>DROP TABLE student</code> is refused while another table references it. The database protects the link, not just the row.'],
    };
    function draw(k) {
      const [par, chi, ok, verd, note] = S[k];
      $('#fk-p').innerHTML = '<thead><tr><th>id</th><th>name</th></tr></thead><tbody>' +
        par.map(r => `<tr class="${(k === 'del' || k === 'drop') && r[0] === '101' ? 'lo' : ''}">` +
          `<td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      $('#fk-c').innerHTML = '<thead><tr><th>id  (fk)</th><th>course_id</th></tr></thead><tbody>' +
        chi.map((r, i) => {
          const isNew = i >= C.length;
          return `<tr class="${isNew ? (ok ? 'hi' : 'lo') : ''}"><td>${r[0]}</td><td>${r[1]}</td></tr>`;
        }).join('') + '</tbody>';
      $('#fk-hd').textContent = 'takes.id references student.id';
      $('#fk-verd').textContent = verd;
      $('#fk-note').innerHTML = note;
      const m = $('#f-fk-msg');
      m.className = 'msg ' + (ok === null ? '' : ok ? 'good' : 'bad');
      m.textContent = 'a foreign key value must exist in the parent, and a referenced parent row cannot vanish';
    }
    setPills($('#f-fk'), 'fk', draw);
    draw('none');
  })();

  /* ---- Fig 2.6 NULL ---- */
  (function () {
    const R = [['p1', 'Asha', 1500], ['p2', 'Ravi', 1100], ['p3', 'Meera', null], ['p4', 'Vikram', 1200]];
    const C = {
      gt: ['rating > 1200', r => r[2] !== null && r[2] > 1200,
        'The unrated player is not kept, but <b>not because 1200 beat them</b>. <code>NULL &gt; 1200</code> is <b>unknown</b>, and WHERE keeps only what is true.'],
      le: ['rating <= 1200', r => r[2] !== null && r[2] <= 1200,
        'They are missing here too. These two conditions look like opposites that should cover everybody, and they do not: <b>the unrated player fails both</b>.'],
      eq: ['rating = NULL', () => false,
        'Zero rows, and <b>no error</b>. Comparing anything to NULL with <code>=</code> gives unknown, so nothing is ever kept. A query that silently returns nothing is far more dangerous than one that fails.'],
      ne: ['rating <> NULL', () => false,
        'Also zero rows, for the same reason. Negating unknown gives unknown, not true.'],
      isn: ['rating IS NULL', r => r[2] === null,
        '<b>This is the only way</b> to find missing values. <code>IS NULL</code> is a special test, not an ordinary comparison.'],
      nn: ['rating IS NOT NULL', r => r[2] !== null,
        'The complement. Between <code>IS NULL</code> and <code>IS NOT NULL</code> every row is accounted for, which the ordinary comparisons could not manage.'],
    };
    function draw(k) {
      const [cond, fn, note] = C[k];
      const kept = R.filter(fn);
      $('#nl-tbl').innerHTML = '<thead><tr><th>id</th><th>name</th><th>rating</th><th>kept?</th></tr></thead><tbody>' +
        R.map(r => {
          const ok = fn(r);
          const unknown = r[2] === null && k !== 'isn' && k !== 'nn';
          return `<tr class="${ok ? 'hi' : 'out'}"><td>${r[0]}</td><td>${r[1]}</td>` +
            `<td${r[2] === null ? ' class="nul"' : ''}>${r[2] === null ? 'NULL' : r[2]}</td>` +
            `<td>${ok ? 'yes' : unknown ? '<i>unknown</i>' : 'no'}</td></tr>`;
        }).join('') + '</tbody>';
      $('#nl-cond').textContent = 'WHERE ' + cond;
      $('#nl-cnt').textContent = kept.length + ' of ' + R.length + ' rows kept';
      $('#nl-note').innerHTML = note;
      const m = $('#f-null-msg');
      m.className = 'msg ' + (k === 'isn' || k === 'nn' ? 'good' : k === 'eq' || k === 'ne' ? 'bad' : '');
      m.textContent = 'a comparison with NULL is unknown, and WHERE keeps only what is true';
    }
    setPills($('#f-null'), 'nl', draw);
    draw('gt');
  })();

  /* ---- Fig 2.7 LIKE ---- */
  (function () {
    const V = ['305500', '305005', '3050', '30050', '305', '30'];
    const P = {
      a: ['30%5_%', 'The worked example: 30, anything, 5, exactly one character, anything. The underscore is the trap, since it demands a character.'],
      b: ['___', 'Three underscores: <b>exactly</b> three characters, no more and no fewer.'],
      c: ['___%', 'Three underscores then a percent: <b>at least</b> three characters, because the percent may match nothing.'],
      d: ['%50%', 'A percent at both ends means the text 50 may appear <b>anywhere</b>: start, middle or end.'],
      e: ['30%', 'A percent only at the end anchors the start: the value must <b>begin</b> with 30.'],
      f: ['_0%', 'One character, then a 0, then anything. The first character is unconstrained but must exist.'],
    };
    function draw(k) {
      const [pat, note] = P[k];
      const rx = new RegExp('^' + pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/_/g, '.').replace(/%/g, '.*') + '$');
      const hits = V.filter(v => rx.test(v));
      $('#lk-tbl').innerHTML = '<thead><tr><th>value</th><th>length</th><th>matches?</th></tr></thead><tbody>' +
        V.map(v => {
          const ok = rx.test(v);
          return `<tr class="${ok ? 'hi' : 'out'}"><td>${v}</td><td>${v.length}</td>` +
            `<td>${ok ? 'yes' : 'no'}</td></tr>`;
        }).join('') + '</tbody>';
      $('#lk-p').innerHTML = "LIKE '" + pat + "'";
      $('#lk-cnt').textContent = hits.length + ' of ' + V.length + ' match';
      $('#lk-note').innerHTML = note;
      $('#f-like-msg').textContent = 'a percent may match nothing; an underscore must match exactly one character';
    }
    setPills($('#f-like'), 'lk', draw);
    draw('a');
  })();

  /* ---- Fig 2.8 ORDER BY ---- */
  (function () {
    const R = [['C4', 'Kerala', 'Kochi'], ['C1', 'Assam', 'Guwahati'], ['C5', 'Kerala', 'Alappuzha'],
      ['C2', 'Assam', 'Silchar'], ['C3', 'Bihar', 'Patna'], ['C6', 'Kerala', 'Thrissur']];
    const S = {
      n: [null, 'stored order', 'No <code>ORDER BY</code>, so the rows arrive however the engine found them. <b>That is not a guarantee</b>: without ORDER BY no order is promised at all.'],
      s: [(a, b) => a[1].localeCompare(b[1]), 'state',
        'Sorted by state alphabetically. Within Kerala the cities are in no particular order, because nothing was said about them.'],
      sc: [(a, b) => a[1].localeCompare(b[1]) || b[2].localeCompare(a[2]), 'state ASC, city DESC',
        'Two passes: states alphabetically, then <b>within</b> each state the cities in reverse. Kerala runs Thrissur, Kochi, Alappuzha.'],
      sa: [(a, b) => a[1].localeCompare(b[1]) || a[2].localeCompare(b[2]), 'state ASC, city ASC',
        'Only the second key changed direction, and only the order <b>within</b> each state changed with it. The state ordering is untouched, which is the whole point of a tie-breaker.'],
      c: [(a, b) => a[2].localeCompare(b[2]), 'city ASC',
        'City alone. States are now scattered, because nothing is sorting them.'],
    };
    function draw(k) {
      const [cmp, hd, note] = S[k];
      const rows = cmp ? [...R].sort(cmp) : R;
      let prev = null;
      $('#or-tbl').innerHTML = '<thead><tr><th>city_code</th><th>state</th><th>city</th></tr></thead><tbody>' +
        rows.map(r => {
          const nd = (k === 's' || k === 'sc' || k === 'sa') && r[1] !== prev;
          prev = r[1];
          return `<tr class="${nd ? 'cu' : ''}">` + r.map(v => `<td>${v}</td>`).join('') + '</tr>';
        }).join('') + '</tbody>';
      $('#or-hd').textContent = cmp ? 'ORDER BY ' + hd : hd;
      $('#or-cnt').textContent = rows.length + ' rows';
      $('#or-note').innerHTML = note;
    }
    setPills($('#f-ord'), 'or', draw);
    draw('n');
  })();

  /* ---- Fig 2.9 GROUP BY ---- */
  (function () {
    const R = [['Ana', 13, 'Australia', 61], ['Ben', 13, 'Australia', 74],
      ['Cara', 16, 'Germany', 88], ['Dev', 16, 'Germany', 55],
      ['Eve', 16, 'Australia', 70], ['Fin', 13, 'Germany', 66]];
    const G = {
      ac: [[1, 2], 'age, country'], a: [[1], 'age'], c: [[2], 'country'], n: [[0], 'name'],
    };
    const H = ['name', 'age', 'country', 'score'];
    function draw(k) {
      const [cols, label] = G[k];
      const groups = {};
      R.forEach(r => {
        const key = cols.map(c => r[c]).join(' | ');
        (groups[key] = groups[key] || []).push(r);
      });
      const keys = Object.keys(groups);
      const colour = {};
      keys.forEach((kk, i) => { colour[kk] = i; });
      $('#gp-src').innerHTML = '<thead><tr>' + H.map((h, j) =>
        `<th style="color:${cols.includes(j) ? 'var(--indigo)' : 'var(--muted)'}">${h}</th>`).join('') +
        '</tr></thead><tbody>' + R.map(r => {
        const key = cols.map(c => r[c]).join(' | ');
        return `<tr class="${colour[key] % 2 === 0 ? 'cu' : ''}">` +
          r.map((v, j) => `<td${cols.includes(j) ? ' class="hl"' : ''}>${v}</td>`).join('') + '</tr>';
      }).join('') + '</tbody>';
      $('#gp-out').innerHTML = '<thead><tr>' + cols.map(c => `<th>${H[c]}</th>`).join('') +
        '<th>COUNT(*)</th></tr></thead><tbody>' +
        keys.map(kk => `<tr class="hi">` + kk.split(' | ').map(v => `<td>${v}</td>`).join('') +
          `<td>${groups[kk].length}</td></tr>`).join('') + '</tbody>';
      $('#gp-hd').textContent = 'GROUP BY ' + label;
      $('#gp-cnt').textContent = keys.length + ' groups from ' + R.length + ' rows';
      $('#gp-note').innerHTML = k === 'ac'
        ? 'Grouping by <b>two</b> columns means rows must agree on <i>both</i> to land in the same pile. Ana and Ben share age 13 and Australia, so they collapse to one row with a count of 2.'
        : k === 'n'
          ? 'Grouping by a column whose values are <b>all different</b> gives one group per row, so the count is 1 everywhere and the grouping achieved nothing. This is the degenerate case.'
          : 'Grouping by one column gives fewer, larger piles than grouping by two. Every extra grouping column can only split groups further, never merge them.';
      $('#f-grp-msg').textContent = 'grouping by more columns gives more groups, each with fewer rows';
    }
    setPills($('#f-grp'), 'gp', draw);
    draw('ac');
  })();

  /* ---- Fig 2.10 minimum without MIN ---- */
  (function () {
    const W = [['Kochi', 320], ['Patna', 110], ['Jaipur', 45], ['Shillong', 480]];
    const S = {
      all: ['SELECT DISTINCT city', 'every city',
        'The first half of the query: all four cities, with nothing removed yet.'],
      gt: ['the self-join, t1.rainfall > t2.rainfall', 'every city except the smallest',
        'The table is joined <b>to itself</b> as t1 and t2, so every city is compared with every other. A city appears here if there is <i>some</i> city with less rainfall. Only <b>Jaipur</b>, the smallest, has nobody below it, so only Jaipur is missing. That is exactly what makes the subtraction work.'],
      exc: ['the EXCEPT of the two', 'the answer',
        'All cities, minus all-but-the-smallest, leaves precisely the smallest: <b>Jaipur</b>. No aggregate function was used anywhere, which is the point of the trick.'],
      lt: ['the wrong one, t1.rainfall < t2.rainfall', 'every city except the LARGEST',
        'Reversing the comparison gives every city smaller than <i>some</i> other city, which is everything except the <b>largest</b>. This is a common wrong option: it looks like a minimum query and answers a completely different question.'],
    };
    function draw(k) {
      const [hd, verd, note] = S[k];
      let rows;
      if (k === 'all') rows = W.map(r => [r[0], r[1], true]);
      else if (k === 'gt') rows = W.map(r => [r[0], r[1], W.some(o => r[1] > o[1])]);
      else if (k === 'lt') rows = W.map(r => [r[0], r[1], W.some(o => r[1] < o[1])]);
      else rows = W.map(r => [r[0], r[1], !W.some(o => r[1] > o[1])]);
      $('#mn-src').innerHTML = '<thead><tr><th>city</th><th>rainfall</th></tr></thead><tbody>' +
        W.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      const kept = rows.filter(r => r[2]);
      $('#mn-out').innerHTML = '<thead><tr><th>city</th></tr></thead><tbody>' +
        (kept.length ? kept.map(r => `<tr class="hi"><td>${r[0]}</td></tr>`).join('')
          : '<tr><td class="nul">empty</td></tr>') + '</tbody>';
      $('#mn-rl').textContent = verd;
      $('#mn-hd').textContent = hd;
      $('#mn-cnt').textContent = kept.length + ' of ' + W.length + ' cities';
      $('#mn-note').innerHTML = note;
      const m = $('#f-min-msg');
      m.className = 'msg ' + (k === 'exc' ? 'good' : k === 'lt' ? 'bad' : '');
      m.textContent = k === 'exc'
        ? 'Jaipur, the minimum, found without MIN, without WHERE on an aggregate and without GROUP BY.'
        : 'subtracting "everything but the smallest" from "everything" leaves the smallest';
    }
    setPills($('#f-min'), 'mn', draw);
    draw('all');
  })();

  /* ---- Fig 2.11 product and natural join ---- */
  (function () {
    const S = [['Jagjit', 'Electronics'], ['Meera', 'Comp. Sci.']];
    const D = [['Electronics', 'Watson'], ['Comp. Sci.', 'Taylor']];
    function draw(k) {
      const rows = [];
      S.forEach(s => D.forEach(d => {
        const match = s[1] === d[0];
        if (k === 'prod') rows.push([s[0], s[1], d[0], d[1], '']);
        else if (k === 'cond') rows.push([s[0], s[1], d[0], d[1], match ? 'hi' : 'out']);
        else if (match) rows.push([s[0], s[1], d[1], 'hi']);
      }));
      const heads = k === 'nat' ? ['name', 'dept', 'building']
        : ['name', 'student.dept', 'department.dept', 'building'];
      $('#cp-tbl').innerHTML = '<thead><tr>' + heads.map(h => `<th>${h}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => `<tr class="${r[r.length - 1]}">` +
          r.slice(0, -1).map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      $('#cp-hd').textContent = k === 'prod' ? 'FROM student, department'
        : k === 'cond' ? 'WHERE student.dept = department.dept' : 'student NATURAL JOIN department';
      $('#cp-cnt').textContent = rows.length + ' rows';
      $('#cp-note').innerHTML = k === 'prod'
        ? '2 &times; 2 = <b>4</b> rows, every pairing. Jagjit is paired with Comp. Sci., which is meaningless: he is in Electronics. Most of a Cartesian product is nonsense, which is why you never stop here.'
        : k === 'cond'
          ? 'The condition keeps only the pairs whose department names agree. The two meaningless rows fall away. <b>This is a join, written by hand.</b>'
          : 'Natural join does the same thing automatically, by matching on the shared column <b>name</b>, and it shows the shared column <b>once</b> instead of twice. Same two rows, one fewer column.';
      $('#f-cart-msg').textContent = 'a join is the product with the meaningless pairs removed';
    }
    setPills($('#f-cart'), 'cp', draw);
    draw('prod');
  })();
}
</script>

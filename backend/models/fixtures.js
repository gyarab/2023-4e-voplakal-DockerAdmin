
let formHtmlPlaceholderData = `<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Email address</label>
<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="inputEmail" required>
<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
</div>
<div class="mb-3">
<label for="instanceName" class="form-label">Instance name</label>
<input type="text" class="form-control" id="instanceName" name="instanceName" required>
</div>
<div class="mb-3 form-check">
<input class="form-check-input" type='hidden' id="exampleCheck1" value='0' name='checkbs'> <!--set unchecked value-->
<input type="checkbox" class="form-check-input" id="exampleCheck1" name="checkbs" value="1" checked>
<label class="form-check-label" for="exampleCheck1">Check me out</label>
</div>

<label for="pet-select">Choose a pet:</label>
<select class="form-select" name="pet" id="pet-select" aria-label="asdfasdf">
<option value="">--Please choose an option--</option>
<option value="dog">Dog</option>
<option value="cat">Cat</option>
<option value="hamster">Hamster</option>
<option value="parrot">Parrot</option>
<option value="spider">Spider</option>
<option value="goldfish">Goldfish</option>
</select>
<div>

<label for="exampleColorInput" class="form-label">Color picker</label>
<input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color" name="color">
</div>

<div class="form-check">
<!--set unchecked value-->
<input class="form-check-input" type='hidden' value='0' name='checkbox1'>
<input class="form-check-input" type='checkbox' value='1' name='checkbox1' id="selfdestruct">
<label class="form-check-label" for="selfdestruct">
    Default ujncehcked checkbox
</label>
</div>
<div class="form-check">
<input class="form-check-input" type='hidden' value='0' name='checkbox2'> <!--set unchecked value-->
<input class="form-check-input" type='checkbox' value='1' name='checkbox2' id="selfdestruct1" checked>
<label class="form-check-label" for="selfdestruct1">
    Default checked checkbox
</label>
</div>

<div class="form-check">
<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="jedna">
<label class="form-check-label" for="flexRadioDefault1">
    Default radio
</label>
</div>
<div class="form-check">
<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked value="dva">
<label class="form-check-label" for="flexRadioDefault2">
    Default checked radio
</label>
</div>

<div class="form-check form-switch">

<input class="form-check-input" type='hidden' value='off' name='flexSwitchCheckDefault'> <!--set unchecked value-->
<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="flexSwitchCheckDefault">
<label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
</div>

<label for="customRange1" class="form-label">Example range</label>
<input type="range" class="form-range" id="customRange1" name="formRange">

<div class="form-floating">
<textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px" name="text"></textarea>
<label for="floatingTextarea2">Comments</label>
</div>
<button type="submit" id="submiter" class="btn btn-primary">Submit</button>`;

let codeExample = `set -e
echo Free port $PORT
docker run -dp $PORT:80 docker/getting-started
`;

let initCodeExample = codeExample;
let runCodeExample = codeExample;
let appsData = [
    {
        name: "Moje prvni pojmenovaní",
        _id: "65a1585d99bb46177b19e518",
        repository: "biobrejn-1",
        folder: "moje-pojmenovani",
        images: [
            {
                tag: "latest",
                image_id: "86552cbc4151",
                created: "7 weeks ago",
                size: "340 MB",
            },
            {
                tag: "recent",
                image_id: "23452345",
                created: "8 weeks ago",
                size: "540 MB",
            },
            {
                tag: "1.3",
                image_id: "88af2227f359",
                created: "8 weeks ago",
                size: "540 MB",
            },
        ],
        selected_image: 0,
        // //computed on mongo
        // image_selected: {
        //   tag: 'latest',
        //   image_id: '08af2227f359',
        //   created: '7 weeks ago',
        //   size: '340 MB',
        // },
        init_code: codeExample,
        run_code: codeExample,
        htmlForm: formHtmlPlaceholderData,
    },
];


let instances = [
    {
        app_id: "65a1585d99bb46177b19e518",
        image_id: "86552cbc4151",
        container_id: "a1ef515e3ec1",
        expiry_date: "2023-11-22",
        created_on: "2023-01-16",
        name: "deh-martin.air345",
        client: "65943b023ec47e78b1cec2b5",
        limits: {
            cpu: 60,
            ram: 2000,
            swap: 444,
            disk: 46666,
        },
    },
];

module.exports = {instances, appsData, codeExample, formHtmlPlaceholderData, initCodeExample, runCodeExample}
import { createStore } from 'vuex'
import { REST } from '../API'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'light',

    apps: [],
    instances: []
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updateApps(state, apps) {
      state.apps = apps;
    },
    updateInstances(state, instances) {
      state.instances = instances;
    },
  },
  actions: {
    async getApps(context) {
      try {
        const response = appsData; //await REST.GET(`apps`);
        context.commit('updateApps', response);
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async createApp(context, imageRepo) {
      try {
        let appID = "22222222" //from api call (imageRepo: "Biobrein") /await REST.POST(`app/create`);
        console.log("create app", imageRepo);
        return appID;
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },



    async getInstances(context) {
      try {
        const response = instances; //await REST.GET(`instances`);
        context.commit('updateInstances', response);
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesUpgrade(ctx, { ids, tag }) {
      try {
        console.log("upgrade", ids, tag);
        ctx.dispatch("getInstances")
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesDelete(ctx, { ids }) {
      try {
        console.log("delete", ids);
        ctx.dispatch("getInstances")
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesStop(ctx, { ids }) {
      try {
        console.log("stop", ids);
        ctx.dispatch("getInstances")
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceCreate(ctx, instance) {
      try {
        console.log("create instance", instance);
        ctx.dispatch("getInstances")
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    }

  },
  modules: {},
})





let formHtmlPlaceholderData = `<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Email address</label>
<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="inputEmail" required>
<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
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

let codeExample = `#!/bin/bash

set -e


# example usage:
example="./restDock containerName port_to_expose"
#	./restDock hrozinka-main 8083

if [[ -z $1 ]] ; then
    echo 'missing argument. You have to specify image name or type help for getting example.'
    exit 1
fi
if [[ $1 == help ]]; then 
  echo $example
fi
if [[ -z $2 ]] ; then
    echo 'missing argument. You have to specify volume dir name! Also used for container name.'
    exit 1
fi
if [[ -z $3 ]] ; then
    echo 'missing argument. You have to specify port to expose!'
    exit 1
fi

mount_dir=$(pwd)/mounts/$2

# check if backend .env.local file exist
if [ -f "$mount_dir/.env.local" ]; then
        echo "config file successfully found"
else
    echo "file $mount_dir/.env.local does not exist"
    exit 1
fi

sudo docker rm -f $2
sudo docker run -dp $3:3000 --name $2 -v "$mount_dir:/app/data" --restart always --network mongo-network $1
`
let appsData = [
  {
    name: "Moje prvni pojmenovaní",
    id: "123432341ščř",
    repository: 'biobrejn-1',
    folder: 'moje-pojmenovani',
    images: [{
      tag: 'latest',
      image_id: '08af2227f359',
      created: '7 weeks ago',
      size: '340 MB',
    }, {
      tag: 'recent',
      image_id: '18af2227f359',
      created: '8 weeks ago',
      size: '540 MB',
    },
    {
      tag: '1.3',
      image_id: '88af2227f359',
      created: '8 weeks ago',
      size: '540 MB',
    }
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
  {
    name: "Moje pojmenovaní",
    id: "123432čř",
    repository: 'biobrejn-1',
    folder: 'moje-pojmenovani',
    images: [{
      tag: 'latest',
      image_id: '08af2227f359',
      created: '7 weeks ago',
      size: '340 MB',
    }, {
      tag: 'recent',
      image_id: '18af2227f359',
      created: '8 weeks ago',
      size: '540 MB',
    },
    {
      tag: 'recent',
      image_id: '88af2227f359',
      created: '8 weeks ago',
      size: '540 MB',
    }
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
]

let instances = [
  {
    id: "62234444",
    app_id: "123432341ščř",
    image: "biobrein1",
    status: "Up 3 days",
    image_id: "23452345",
    expiry_date: "2023-11-22",
    name: "deh-martin.air345",
    client: "pepa.novak@seznam.cz",
    limits: {
      cpu: 60,
      ram: 2000,
      swap: 444,
      disk: 46666
    }
  },
  {
    id: "12234445",
    app_id: "123432341ščř",
    client: "pepa.novak@seznam.cz",
    expiry_date: "2023-11-22",
    container_id: "2cea44557dcb",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
  {
    id: "12234445",
    app_id: "123432čř",
    client: "pepa.novak@seznam.cz",
    expiry_date: "2023-11-22",
    container_id: "2cea44557dcb",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
  {
    id: "12234445",
    app_id: "123432čř",
    container_id: "2cea44557dcb",
    client: "pepa.novak@seznam.cz",
    expiry_date: "2023-11-22",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
]



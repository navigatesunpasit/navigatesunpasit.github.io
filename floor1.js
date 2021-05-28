const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} name the name of the Task
 * @param {string} iconLocation
 * @param {string} imageLocation1
 * @param {string} imageLocation2
 * @param {string} imageLocation3
 * @param {string} imageLocation4
 * @param {string} route1
 * @param {string} route2
 * @param {string} route3
 * @param {string} route4
 * @param {string} status
 *  the imageLocation of the Task
 */
const saveTask = (name, iconLocation, imageLocation1, imageLocation2, imageLocation3, imageLocation4, route1, route2, route3, route4, status) =>
  db.collection("floor1").doc().set({
    name,
    iconLocation,
    imageLocation1,
    imageLocation2,
    imageLocation3,
    imageLocation4,
    route1,
    route2,
    route3,
    route4,
    status

  });

const getTasks = () => db.collection("floor1").get();

const onGetTasks = (callback) => db.collection("floor1").onSnapshot(callback);

const deleteTask = (id) => db.collection("floor1").doc(id).delete();

const getTask = (id) => db.collection("floor1").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('floor1').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${task.name}</h3>
    <p>icon: ${task.iconLocation}</p>
    <p>สถานะการใช้งาน: ${task.status}</p>
    <p>รูปที่ 1</p>
    <img src="${task.imageLocation1}" alt="center">
    <p>รูปที่ 2</p>
    <img src="${task.imageLocation2}" alt="center">
    <p>รูปที่ 3</p>
    <img src="${task.imageLocation3}" alt="center">
    <p>รูปที่ 4</p>
    <img src="${task.imageLocation4}" alt="center">
    <p>เส้นทาง 1</p>
    <p>${task.route1}</p>
    <p>เส้นทาง 2</p>
    <p>${task.route2}</p>
    <p>เส้นทาง 3</p>
    <p>${task.route3}</p>
    <p>เส้นทาง 4</p>
    <p>${task.route4}</p>

    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        // alert("You Delete");
        window.confirm("You do want to delete?");
        if (confirm("OK")) {
           deleteTask(e.target.dataset.id);
        } else {
          console.log(error);
        }
        // try {
        //   await deleteTask(e.target.dataset.id);
        // } catch (error) {
        //   console.log(error);
          // window.prompt("You do want to delete?")
        // }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-name"].value = task.name;
          taskForm["task-iconLocation"].value = task.iconLocation;
          taskForm["task-imageLocation1"].value = task.imageLocation1;
          taskForm["task-imageLocation2"].value = task.imageLocation2;
          taskForm["task-imageLocation3"].value = task.imageLocation3;
          taskForm["task-imageLocation4"].value = task.imageLocation4;
          taskForm["task-route1"].value = task.route1;
          taskForm["task-route2"].value = task.route2;
          taskForm["task-route3"].value = task.route3;
          taskForm["task-route4"].value = task.route4;
          taskForm["task-status"].value = task.status;


          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskForm["task-name"];
  const iconLocation = taskForm["task-iconLocation"];
  const imageLocation1 = taskForm["task-imageLocation1"];
  const imageLocation2 = taskForm["task-imageLocation2"];
  const imageLocation3 = taskForm["task-imageLocation3"];
  const imageLocation4 = taskForm["task-imageLocation4"];
  const route1 = taskForm["task-route1"];
  const route2 = taskForm["task-route2"];
  const route3 = taskForm["task-route3"];
  const route4 = taskForm["task-route4"];
  const status = taskForm["task-status"];


  try {
    if (!editStatus) {
      await saveTask(name.value, iconLocation.value, imageLocation1.value, imageLocation2.value, imageLocation3.value, imageLocation4.value, route1.value, route2.value, route3.value, route4.value, status.value);
    } else {
      await updateTask(id, {
        name: name.value,
        iconLocation: iconLocation.value,
        imageLocation1: imageLocation1.value,
        imageLocation2: imageLocation2.value,
        imageLocation3: imageLocation3.value,
        imageLocation4: imageLocation4.value,
        route1: route1.value,
        route2: route2.value,
        route3: route3.value,
        route4: route4.value,
        status: status.value,

      });

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    name.focus();
  } catch (error) {
    console.log(error);
  }
});
// เมื่อผู้ใช้เลื่อนหน้าเว็บจะรัน myFunction
window.onscroll = function () { myFunction() };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get ตำแหน่งออฟเซตของ navbar
var sticky = navbar.offsetTop;


// เพิ่ม sticky ลงใน navbar เมื่อคุณไม่ได้เลื่อน "sticky" จะถูกลบออก
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

function logout(){
  firebase.auth().signOut();
}
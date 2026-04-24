window.login = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const results = await window.electronAPI.invoke("login", email, password);

    if (results.length > 0) {
      localStorage.setItem("usuario", JSON.stringify(results[0]));

      window.location.href = "perfil.html";
    } else {
      alert("Usuario incorrecto");
    }
  } catch (err) {
    console.log(err);
  }
};
const headerSelect = document.querySelector('.header__languages');
const allLang = ['en', 'rus', 'lv'];
const defLang = allLang[0]

const getLangFromLocalStorage = localeStr => {
    if (localeStr) {
        localStorage.setItem("locale", localeStr)
    }
    if (typeof localStorage.getItem("locale") != 'string') {
        activeItemsCount = 0
        Array.from(headerSelect.children).forEach(child => {
            if (child.classList.contains('active')) {
                localStorage.setItem("locale", (child.textContent).trim())
                activeItemsCount = activeItemsCount + 1
            }
        })
        if (!activeItemsCount) {
            localStorage.setItem("locale", defLang);
            document.querySelector(`[data-pagelang=${defLang}]`).classList.add('active')
        }
    } else {
        const locale = localStorage.getItem("locale");
        Array.from(headerSelect.children).forEach(child => {
            child.classList.remove('active')
        })
        document.querySelector(`[data-pagelang=${locale.toLowerCase()}]`)?.classList.add('active')
    }
    const locale = localStorage.getItem("locale")
    return locale
}

window.onload = () => {
    getLangFromLocalStorage()
    changeLanguage()
};

headerSelect.addEventListener('click', e => {
    if (e.target.classList.contains('header__languages-link')) {
        Array.from(headerSelect.children).forEach(child => {
            child.classList.remove('active')
        })
        e.target.classList.add('active')
        getLangFromLocalStorage(e.target.dataset.pagelang)
        changeLanguage()
    }
});

function changeLanguage() {
    let locale = localStorage.getItem("locale").toLowerCase();

    const promise = () => {
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();

            xhr.open('GET', './assets/js/language.json');

            xhr.responseType = 'json';

            xhr.send()

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.response)
                }
            }

        })
    };

    promise()
        .then(res => JSON.parse(JSON.stringify(res)))
        .then(res => {

            for (const sectionKey in res) {
                for (const elemKey in res[sectionKey]) {
                    const elem = document.querySelector(`#lng-${sectionKey}-${elemKey}`)
                    if (elem) {
                        elem.innerHTML = res[sectionKey][elemKey][localStorage.getItem("locale")]
                    }
                }
            }

        })
        .catch(err => {
            console.log(err);
            promise()
        })
}
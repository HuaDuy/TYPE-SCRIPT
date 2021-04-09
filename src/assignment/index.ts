import Navbar from '../component/navbar';
import { $, reRender } from '../ultil';
import swal from 'sweetalert';

export default class assignment {
    async render() {

        // ***** XỬ LÝ DỮ LIỆU ***** //
        
        let result:string = '';
        const pokemons: number = 20;

        interface PokemonInterface {
            id: number,
            image: string
        }

        let arrPokemon: PokemonInterface[] = [];

        for (let i = 10; i < pokemons; i++) {
            let data: any = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            let pokemon: any = await data.json();
            arrPokemon = [...arrPokemon, { id: pokemon.id, image: pokemon.sprites.front_default }];
        }

        const cardPokemon: any = [...arrPokemon, ...arrPokemon];

        cardPokemon.sort(() => {
            return Math.random() - 0.5;
        })

        cardPokemon.forEach((item: any, index: number) => {
            result += `<img src="${item.image}" id_pokemon="${item.id}" index="${index}" class="poke" height="150px">`
        });

        $('#navbar').innerHTML = await Navbar.render();
        $('.point').style.visibility = "";
        $('.point').innerHTML = "Điểm: 0";

        return `
            ${result}
        `
    };
    async afterRender() {

        // ***** LOGIC GAME *****

        // Khai báo
        let focusPokemon: HTMLElement[] = [];               // Tạo mảng chứa các element được focus
        let count: number = 0;                              // Tạo biến đếm số lượng element focus
        let totalPoint: number = 0;                         // Tạo biến tổng điểm
        let duplicatePokemon: number = 0;                    // Tạo biến đếm số cặp pokemon đã đoán trúng
        const userName: string = localStorage.getItem('user');   // Lấy tên người dùng từ localStorage
        const poke: HTMLElement[] = $('.poke');              // Lấy toàn bộ các element pokemon


        // Game play

        poke.forEach((item: HTMLElement) => {               // Lặp qua tất cả phần tử có trong mảng poke
            item.addEventListener('click', () => {          // Thêm sự kiện onclick cho từng phần tử có trong mảng
                item.classList.add("pokeFocus");            // Khi thực hiện sự kiện click trên element thực hiện thêm classname pokeFocus cho element
                focusPokemon = [...focusPokemon, item];     // Thêm element đã thực hiện sự kiện vào trong mảng focusPokemon
                count++;                                     // Tăng biến đếm thêm 1

                if (count >= 2) {                           // Nếu biến đếm >=2 ~ đã có 2 element được focus => Nếu giống nhau thì xóa || khác nhau thì bỏ focus
                    count = 0;                               // Reset biến đếm về 0 để thực hiện focus lại

                    if (focusPokemon[0].getAttribute("id_pokemon") ==           // Thực hiện xét 2 điều kiện:
                        focusPokemon[1].getAttribute("id_pokemon") &&           // -- id_pokemon của 2 element bằng nhau ( để xóa những hình giống nhau )
                        focusPokemon[0].getAttribute("index") !=                 // index của 2 element khác nhau ( để tránh người dùng nhấn cùng 1 hình )
                        focusPokemon[1].getAttribute("index")) {
                    // Nếu chọn đúng ( Thỏa mãn cả 2 điều kiện )
                        focusPokemon.forEach((item: HTMLElement) => {            // Thực hiện lặp qua các phần tử của mảng focusPokemon
                            item.style.visibility = "hidden";                   // Thêm thuộc tính visibility = "hidden" cho các item đã đúng
                        })
                        totalPoint += 100;                          // Cộng cho người chơi 100 điểm vì đoán đúng
                        duplicatePokemon += 1;                      // Số cặp pokemon đoán đúng tăng thêm 1

                    // Nếu chọn sai ( Vi phạm 1 trong 2 điều kiện )
                    } else {                  

                        focusPokemon.forEach(item => {                      // Thực hiện lặp qua các phần tử của mảng focusPokemon  
                            item.classList.remove("pokeFocus");            // Bỏ class pokeFocus ở các element
                        })
                        if (totalPoint > 0) {                       // Set điểm tối thiểu là 0
                            totalPoint -= 50;                        // Trừ của người chơi đi 50 điểm
                        }
                    }
                    focusPokemon = [];                   // Reset mảng focusPokemon để thực hiện lại từ đầu

                    // Hiển thị điểm
                    $('.point').innerHTML = 'Điểm: ' + totalPoint;
                }

                // Thông báo người chơi chiến thắng
                if (duplicatePokemon == 10) {
                    swal("Chúc mừng!", `${userName} đã dành chiến thắng với số điểm là: ${totalPoint}`, "success");
                }
            })
        });


        // Chơi game lại
        const Assignment = new assignment();
        const restartBtn: HTMLElement = $('#navbar .restart');
        restartBtn.addEventListener('click', async function () {
            swal({
                title: "Bạn chắc chắn muốn chơi lại",
                text: "Click ra ngoài để hủy",
                icon: "warning",
                dangerMode: true,
            })
                .then(async (willDelete: boolean) => {
                    if (willDelete) {
                        swal("Chơi lại thành công", {
                            icon: "success",
                        });
                        reRender(Assignment, '#content')    // Render lại content
                    } else {
                        swal("Bạn đã hủy!");
                    }
                });
        })

        // Đăng xuất game
        const logoutBtn:HTMLElement = $('#navbar .logout');
        logoutBtn.addEventListener('click', async function () {
            localStorage.removeItem('user');    // Xóa user trong localStorage
            $('#navbar').innerHTML = '';
            window.location.hash = '';
        })
    }
}
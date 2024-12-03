import fs from 'fs';
import {Command} from 'commander';
const program = new Command();
import chalk from 'chalk';

const path = "./Todo.txt";
const readTodo = () =>{
    try{
        const data = fs.readFileSync(path,"utf-8");
        //return data in a array also filters out empty spaces if exists
        return data.split("/n").filter( line => line.trim() !== '');
    }catch(error){
        //if no such dir exists
        if(error.code === "ENOENT"){
            return [];
        }else{
            throw error;
        }
    }
}

const saveTodo = (todos) => {
    const data = todos.join("/n");
    fs.writeFileSync(path,data);
}


program
    .name("TODO_LIST")
    .description("Lets you add,delete,edit and view your todos")
    .version("0.8.0");

    program.command("Add")
        .description("Lets you add your todo")
        .arguments('<String>', 'add your todo')
        .action((todo) => {
            //get todo
            const todos = readTodo(); 
            //add the todo given by user
            todos.push(todo);
            //save it in file
            saveTodo(todos);

            console.log(chalk.green.bold(`TODO added : ${todo}` ));
        })

    
    program.command("DeleteLastTodo")
        .description("lets you delete last todo")
        .action(()=>{
            const todos = readTodo();

            if(todos.length === 0){
                return console.log(chalk.red.bold((`TODO_LIST is alread empty`)));
            }
            //store delted todo in a var
            const x = todos.pop();
            saveTodo(todos);

            console.log(chalk.green.bold(`TODO deleted => ${x}`));
        })



    program.command("Show")
        .description("Shows your all todos")
        .action(()=>{
            const todos = readTodo();
            if(todos.length === 0){
                return console.log(chalk.red.bold((`TODO_LIST is alread empty`))); 
            }   

            todos.forEach((element,index)  => {
                if(element.startsWith('[Completed]')){
                    console.log(chalk.yellow.italic(`${index+1} ${todos[index]}`))
                }else{
                    console.log(chalk.red.italic(`${index+1} ${todos[index]}`));
                }
            })
        })


    program.command('Edit')
        .description(`Lets you edit your old todo`)
        .argument(`<String>, <old_todo> -> previously added todo`)
        .argument(`<String>, <new_todo> -> new todo to replace with old todo`)
        .action((old_todo,new_todo) => {
            const todos = readTodo();
            const idx = todos.indexOf(old_todo);

            todos[idx] = new_todo;

            console.log(chalk.green.bold(`Your todo ${old_todo} is updated successfully with ${new_todo}`));
            saveTodo(todos);
        })

    program.command('Complete')
        .description("let you mark todo as complete")
        .argument(`<String>, todo you want to mark as compelete`)
        .action((todo)=> {
            let todos = readTodo();
            let idx = todos.indexOf(todo);

            if(idx === -1){
               return console.log(chalk.red.italic(`todo can't be found`));
            }
            todos[idx] = `[Completed] ${todos[idx]}`;

            console.log(chalk.yellow.bold(`Your todo ${todo} have been successfully marked as 'Completed'` ))
            saveTodo(todos);
        })


    program.command("Delete")
        .description("Deletes the todo")
        .argument("<String>, specify the todo to be deleted")
        .action((todo) =>{
            const todos = readTodo();
            //if arry is empty
            if(todos.length === 0){
                return console.log(chalk.red.bold(`TODO_LIST is already empty`));
            }

            const idx = todos.indexOf(todo);
            //delete the particular todo
            let x = todos.splice(idx,1);
            saveTodo(todos);

            console.log(chalk.green.bold(`TODO ${x} is deleted successfully`));
        })

    
    program.parse();

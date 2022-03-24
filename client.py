import threading
import socket
from time import sleep


def main():
    '''Inicia a comunicação com o servidor'''
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client.connect(("localhost", 7777))
    except:
        return print("\nNão foi possívvel se conectar ao servidor!\n")

    username = input("Usuário> ")
    print("\nConectado")

    threadReceive = threading.Thread(target=receiveMessages, args=[client])
    threadMessage = threading.Thread(
            target=sendMessages,
            args=[client, username]
            )

    threadReceive.start()
    threadMessage.start()


def receiveMessages(client):
    '''Responsável por "ouvir" o recebimento das mensagens'''
    while True:
        try:
            msg = client.recv(2048).decode("utf-8")
            print(msg + "\n")
        except:
            print("\nNão foi possível permanecer conectado no servidor!\n")
            print("Pressione <Enter> Para continuar...")
            client.close()
            break


def sendMessages(client, username):
    '''Responsável por executar o envio das mensagens'''

    sleep(0.2)
    client.send(f"\nNovo usuário  conectado: {username}".encode("utf-8"))

    while True:
        try:
            msg = input("\n")
            client.send(f"<{username}> {msg}".encode("utf-8"))
        except:
            return


main()

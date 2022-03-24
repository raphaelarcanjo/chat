import threading
import socket
from time import sleep


clients = []


def main():
    '''Inicia o servidor'''
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        server.bind(("localhost", 7777))
        server.listen()
    except:
        return print("\nNão foi possível iniciar o servidor!\n")

    while True:
        client, addr = server.accept()
        clients.append(client)

        thread = threading.Thread(
                target=messagesTreatment,
                args=[client]
                )
        thread.start()


def messagesTreatment(client):
    '''Responsável por tratar as mensagens dos clientes'''
    while True:
        try:
            msg = client.recv(2048)
            broadcast(msg, client)
        except:
            deleteClient(client)
            break


def broadcast(msg, client):
    '''Responsável pelo envio das mensagens para todos os clientes'''
    for clientItem in clients:
        if clientItem != client:
            try:
                clientItem.send(msg)
            except:
                deleteClient(clientItem)


def deleteClient(client):
    '''Responsável por excluir um cliente'''
    clients.remove(client)


main()
